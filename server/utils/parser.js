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

    // Try PDF first. If it's not a PDF (e.g., docx), pdf-parse will throw.
    // Fall back to DOCX.
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (err) {
        try {
            const data = await mammoth.extractRawText({ buffer });
            return data.value;
        } catch (err2) {
            // Provide a clearer error for the route/controller.
            const msg = err?.message || String(err);
            const msg2 = err2?.message || String(err2);
            throw new Error(`Failed to extract text. Tried PDF parse error: ${msg}. DOCX parse error: ${msg2}`);
        }
    }
};
