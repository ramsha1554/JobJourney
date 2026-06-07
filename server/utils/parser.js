const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const mammoth = require('mammoth');
const axios = require('axios');

exports.extractTextFromBuffer = async (buffer, originalname) => {
    const extension = originalname.split('.').pop().toLowerCase();

    if (extension === 'pdf') {
        const data = await pdfParse(buffer);
        return data.text;
    } else if (extension === 'doc' || extension === 'docx') {
        const data = await mammoth.extractRawText({ buffer });
        return data.value;
    }

    throw new Error('Unsupported file format. Please upload PDF or DOCX.');
};

exports.extractTextFromUrl = async (url) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    try {
        const data = await pdfParse(buffer);
        return data.text;
    } catch (err) {
        try {
            const data = await mammoth.extractRawText({ buffer });
            return data.value;
        } catch (err2) {
            const msg = err?.message || String(err);
            const msg2 = err2?.message || String(err2);
            throw new Error(`Failed to extract text. PDF: ${msg}. DOCX: ${msg2}`);
        }
    }
};