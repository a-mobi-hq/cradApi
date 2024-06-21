const Answer = require('../models/AnswerModel'); // Import the Answer model
const Question = require('../models/QuestionModel'); // Import the Question model

// Controller to fetch one unanswered question by user ID, question type, and question subtype
const getUnansweredQuestion = async (req, res) => {
  try {
    const { userId, projectId, questionType, questionSubType } = req.params;

    // Find all answered question IDs by the user and project
    const answeredQuestions = await Answer.find({ userId, projectId }).distinct('questionId');

    // Find an unanswered question by the user, project, question type, and question subtype
    const unansweredQuestion = await Question.findOne({
      questionType,
      questionSubType,
      _id: { $nin: answeredQuestions }, // Exclude answered question IDs
    });

    if (!unansweredQuestion) {
      return res.status(200).json({ error: 'No unanswered question found' });
    }

    res.status(200).json({ status: 200, data: unansweredQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllAnswersByTypeSubTypeAndProjectId = async (req, res) => {
  try {
    console.log("here jdu");
    const { questionType, questionSubType, projectId } = req.params;
     console.log(req.params);

    // Find the questionId based on the provided questionType and questionSubType
    const question = await Question.findOne({ questionType, questionSubType });
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Find all answers that match the questionId and projectId
    const answers = await Answer.find({ projectId });

    res.status(200).json({ status: 200, data: answers });
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getUnansweredQuestion,getAllAnswersByTypeSubTypeAndProjectId };
