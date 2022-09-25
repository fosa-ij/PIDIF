const mongoose = require('mongoose')
require('dotenv').config({path: './config/.env'})

// Init gfs bucket
const gridFSBucket = () => {
    const connection = mongoose.connection
    return gfsb = new mongoose.mongo.GridFSBucket(connection, { 
        bucketName: 'uploads' 
    })
}


// Basic node example that prints document metadata and text content.

// Run `gulp dist-install` to generate 'pdfjs-dist' npm package files.
const pdfjsLib = require("pdfjs-dist");

// Loading file from file system into typed array
// const pdfPath = "../../docs/pdf.pdf"
//   process.argv[2] || "../../web/compressed.tracemonkey-pldi-09.pdf";

module.exports = {
    getPdf: (req, res) => {
        try{
            gridFSBucket().find({}).toArray((err, files) => {
                // check if files exist
                if (!files || files.length === 0) {
                    return res.status(404).json({
                        err: 'No files exist'
                    });
                }
                // If file exist
                const file = files.filter(allFiles => allFiles.filename === req.params.filename)

                // If file exists
                // res.render("home.ejs", { file: file });
                console.log(file[0])
                if (file[0].contentType === 'application/pdf') {
                    console.log(file[0].filename);

                    // // Read output to browser
                    // const readstream = gridFSBucket()
                    // .openDownloadStreamByName(file[0].filename);
                    // readstream.pipe(res)
                    console.log('i got here babyyy');

                    // Will be using promises to load document, pages and misc data instead of
                    // callback.
                    const loadingTask = pdfjsLib.getDocument(file[0]);
                    loadingTask.promise
                    .then(function (doc) {
                        const numPages = doc.numPages;
                        console.log("# Document Loaded");
                        console.log("Number of Pages: " + numPages);
                        console.log();
            
                        let lastPromise; // will be used to chain promises
                        lastPromise = doc.getMetadata().then(function (data) {
                        console.log("# Metadata Is Loaded");
                        console.log("## Info");
                        console.log(JSON.stringify(data.info, null, 2));
                        console.log();
                        if (data.metadata) {
                            console.log("## Metadata");
                            console.log(JSON.stringify(data.metadata.getAll(), null, 2));
                            console.log();
                        }
                        });
            
                        const loadPage = function (pageNum) {
                        return doc.getPage(pageNum).then(function (page) {
                            console.log("# Page " + pageNum);
                            const viewport = page.getViewport({ scale: 1.0 });
                            console.log("Size: " + viewport.width + "x" + viewport.height);
                            console.log();
                            return page
                            .getTextContent()
                            .then(function (content) {
                                // Content contains lots of information about the text layout and
                                // styles, but we need only strings at the moment
                                const strings = content.items.map(function (item) {
                                return item.str;
                                });
                                console.log("## Text Content");
                                console.log(strings.join(" "));
                                // Release page resources.
                                page.cleanup();
                            })
                            .then(function () {
                                console.log();
                            });
                        });
                        };
                        // Loading of the first page will wait on metadata and subsequent loadings
                        // will wait on the previous pages.
                        for (let i = 1; i <= numPages; i++) {
                        lastPromise = lastPromise.then(loadPage.bind(null, i));
                        }
                        res.render('pdf.ejs', {})
                        return lastPromise;
                    })
                    .then(
                        function () {
                        console.log("# End of Document");
                        },
                        function (err) {
                        console.error("Error: " + err);
                        }
                    );
                } else {
                    res.status(404).json({
                        err: 'Not a PDF'
                    })
                }
            });
        } catch(err){
            console.error(err)
        }
    }
}