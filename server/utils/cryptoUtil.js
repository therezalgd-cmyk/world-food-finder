const crypto = require('crypto');

// এনক্রিপ্ট করার ফাংশন
function encrypt(text) {
    if (!text) return '';
    const algorithm = 'aes-256-cbc';
    // টেস্ট করার জন্য একটি সাধারণ সিক্রেট কি (৩২ ক্যারেক্টার)
    const key = crypto.scryptSync(process.env.CRYPTO_SECRET || 'secret_password_must_be_32_chars', 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
}

module.exports = { encrypt };
