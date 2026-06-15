const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const generativedescription = async (req, res) => {
    const { title } = req.body
    try {
        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            })
        }
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        const prompt = `Generate a clear and concise issue description for a project management tool. Issue title: "${title}". Keep it under 100 words.`
        const result = await model.generateContent(prompt)
        const description = result.response.text()
        res.status(200).json({
            success: true,
            description
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

module.exports = generativedescription