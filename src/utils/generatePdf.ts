import { Readable } from 'stream';
import * as puppeteer from "puppeteer";
import * as PDFDocument from "pdfkit";
import pdf from "html-pdf"
// export async function generatePdf(content: string){
//   return new Promise<Buffer>((resolve, reject) => {
//     const doc = new PDFDocument();
//     let buffers = [];

//     // Collecting data in buffers
//     doc.on('data', buffers.push.bind(buffers));
//     doc.on('error', reject); // Reject promise on error

//     // When the PDF has finished being generated, concatenate buffers and resolve the promise
//     doc.on('end', () => {
//       const pdfBuffer = Buffer.concat(buffers);
//       resolve(pdfBuffer);
//     });

//     // Adding content to the PDF
//     doc.fontSize(15).text(content);

//     // Finalizing the PDF and triggering the 'end' event
//     doc.end();
//   });
//   }

const tableCss = `
<style>
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #f2f2f2;
    }
    tr:hover {
        background-color: #f5f5f5;
    }
</style>
`;

// Combine the table CSS with the HTML content


const pdf = require('html-pdf');


export async function generatePdf(htmlContent: string): Promise<Buffer> {
    // Combine the table CSS with the HTML content
    const fullHtmlContent = `${tableCss}${htmlContent}`;
    
    // Create a promise to generate the PDF
    return new Promise((resolve, reject) => {
        pdf.create(fullHtmlContent, { format: 'A4', border: '10mm' }).toBuffer((err, buffer) => {
            if (err) {
                return reject(err);
            }
            resolve(buffer);
        });
    });
}
