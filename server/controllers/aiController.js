import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";
// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: 'system',
                    content:
                        'You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly, and return only the improved text.',
                },
                {
                    role: 'user',
                    content: userContent,
                },
            ],
        })

        const enhancedContent =
            response.choices[0].message.content;
        return res.status(200).json({ enhancedContent })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: 'system',
                    content:
                        'You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be rewritten into 1–2 concise sentences that highlight key responsibilities and achievements. Use strong action verbs and quantifiable results where possible. Make it ATS-friendly and return only the improved text.',
                },
                {
                    role: 'user',
                    content: userContent,
                },
            ]
        })

        const enhancedContent =
            response.choices[0].message.content;
        return res.status(200).json({ enhancedContent })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


// controller for uploading a resume to databse
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {

        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const systemPrompt = 'You are an expert AI agent that extracts structured data from resumes.';

        const userPrompt = `Extract all relevant data from this resume: ${resumeText}
        
        Provide data in the following JSON format with no additional text before or after:

        {
         professional_summary: {
            type: String,
            default: '',
        },
        skills: [
            {
                type: String,
            },
        ],
        personal_info: {
            image: { type: String, default: '' },
            full_name: { type: String, default: '' },
            profession: { type: String, default: '' },
            email: { type: String, default: '' },
            phone: { type: String, default: '' },
            location: { type: String, default: '' },
            linkedin: { type: String, default: '' },
            website: { type: String, default: '' },
        },
        experience: [
            {
                company: { type: String, default: '' },
                position: { type: String, default: '' },
                start_date: { type: String, default: '' },
                end_date: { type: String, default: '' },
                description: { type: String, default: '' },
                is_current: { type: Boolean, default: false },
            },
        ],
        project: [
            {
                name: { type: String, default: '' },
                type: { type: String, default: '' },
                description: { type: String, default: '' },
            },
        ],

        education: [
            {
                institution: { type: String, default: '' },
                degree: { type: String, default: '' },
                field: { type: String, default: '' },
                graduation_date: { type: String, default: '' },
                gpa: { type: String, default: '' },
            },
        ],
        }
        `;


        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt,
                },
            ],
            response_format: { type: 'json_object' }
        })

        const extractedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extractedData)
        const newResume = await Resume.create({ userId, title, ...parsedData })

        res.json({ resumeId: newResume._id })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


