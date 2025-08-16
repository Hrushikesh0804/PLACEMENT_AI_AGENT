const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env vars correctly relative to this file's location
dotenv.config({ path: path.join(__dirname, '.env') });

// Load models
const Exam = require('./models/Exam');
const Question = require('./models/Question');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
    try {
        // Clear existing exam data
        await Exam.deleteMany();
        await Question.deleteMany();
        console.log('Previous exam data destroyed...');

        // Read the JSON file
        const questionsPath = path.join(__dirname, '../cs_mcqs.json'); // Assumes cs_mcqs.json is in the root
        const allQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

        // Group questions by subject and difficulty
        const groupedExams = {};
        allQuestions.forEach(q => {
            const key = `${q.subject}-${q.difficulty}`;
            if (!groupedExams[key]) {
                groupedExams[key] = [];
            }
            groupedExams[key].push(q);
        });

        console.log('Found and grouped questions for exams...');

        // Create an Exam for each group and then insert the questions
        for (const key in groupedExams) {
            const [subject, difficulty] = key.split('-');
            const questionsForExam = groupedExams[key];

            // Create the Exam document
            const newExam = await Exam.create({
                title: `${subject} Exam - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
                role: 'Software Engineer', // Assigning a default role
                topic: subject,
                difficulty: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
                duration: Math.ceil(questionsForExam.length * 1.5), // e.g., 90 seconds per question
            });

            // Prepare questions by adding the new exam's ID
            const questionsToInsert = questionsForExam.map(q => {
                // Find the correct answer index
                const correctAnswerIndex = q.options.indexOf(q.answer);
                return {
                    exam: newExam._id,
                    questionText: q.question,
                    options: q.options,
                    correctAnswerIndex: correctAnswerIndex,
                };
            });

            // Insert all questions for this exam
            await Question.insertMany(questionsToInsert);
            console.log(`  -> Created '${newExam.title}' with ${questionsToInsert.length} questions.`);
        }

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (err) {
        console.error('Error during data import:', err);
        process.exit(1);
    }
};

// To run the script: node server/seeder.js
// To destroy data (optional): node server/seeder.js -d
if (process.argv[2] === '-d') {
    // Optional: Add a destroy data function if needed
    console.log('Destroy functionality not implemented in this version.');
    process.exit();
} else {
    importData();
}
