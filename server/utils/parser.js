const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');

exports.extractTextFromUrl = async (url) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    try {
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        return result.text;
    } catch (err) {
        try {
            const data = await mammoth.extractRawText({ buffer });
            return data.value;
        } catch (err2) {
            throw new Error(`Failed to extract text. PDF: ${err?.message}. DOCX: ${err2?.message}`);
        }
    }
};

exports.extractTextFromBuffer = async (buffer, originalname) => {
    const extension = originalname.split('.').pop().toLowerCase();
    if (extension === 'pdf') {
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        return result.text;
    } else if (extension === 'doc' || extension === 'docx') {
        const data = await mammoth.extractRawText({ buffer });
        return data.value;
    }
    throw new Error('Unsupported file format.');
};