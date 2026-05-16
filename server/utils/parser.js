const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');

/**
 * Extracts text from a file (PDF or DOCX) given its URL/Path.
 */
exports.extractTextFromBuffer = async (buffer, originalname) => {
    const extension = originalname.split('.').pop().toLowerCase();

    if (extension === 'pdf') {
        const data = await pdf(buffer);
        return data.text;
    } else if (extension === 'doc' || extension === 'docx') {
        const data = await mammoth.extractRawText({ buffer });
        return data.value;
    }
    
    throw new Error('Unsupported file format. Please upload PDF or DOCX.');
};

/**
 * Fetches a file from a URL and extracts its text.
 * Useful for resumes stored on Cloudinary.
 */
exports.extractTextFromUrl = async (url) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    
    // We assume PDF for Cloudinary raw files if we don't have the original name, 
    // but Cloudinary URLs often contain the format or public ID.
    // For simplicity, we try PDF then DOCX.
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (err) {
        const data = await mammoth.extractRawText({ buffer });
        return data.value;
    }
};
