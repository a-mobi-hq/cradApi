const Answer = require('../models/AnswerModel'); 
const Question = require('../models/QuestionModel'); // Adjust the path as needed // Import the Answer model
const Joi = require('joi');
// Controller to create a new answer
const createAnswer = async (req, res) => {
  try {
    console.log("here");
    // const schema = Joi.object({
    //     userId: Joi.string().required(),
    //     questionId: Joi.string().required(),
    //   });
  
    // const { error } = schema.validate(req.body);
    // if (error) {
    //     return res.status(400).json({ error: error.details[0].message });
    //   }
    const { userId, questionId, questionType, questionSubType, projectId, answer } = req.body.data;

    // Check if any of the required fields are empty
    if (!userId) {
        return res.status(400).json({ error: 'Please Login' });
      }
      if (!questionId) {
        return res.status(400).json({ error: 'No question asked' });
      }
      if (!answer) {
        return res.status(400).json({ error: 'empty Answer' });
      }

      if (!projectId) {
        return res.status(400).json({ error: 'Please Select Project' });
      }

    const newAnswer = new Answer({
      userId,
      questionId,
      questionType,
      questionSubType,
      projectId,
      answer,
    });

    await newAnswer.save();

    res.status(200).json({ status: 200, message: 'Answer added successfully', data: newAnswer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const getAnswersByCriteria = async (req, res) => {
  const { projectId, questionType, questionSubType } = req.params;
  console.log(req.params);

  try {
    const answers = await Answer.find({
      projectId,
      questionType,
      questionSubType,
    });

    if (answers.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No answers found for the given criteria',
      });
    }

    // Fetch related questions for each answer
    const questionIds = answers.map(answer => answer.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    // Merge answers with corresponding question details
    const answersWithQuestions = answers.map(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      return {
        ...answer._doc, // Include all answer fields
        question: question ? question.question : null, // Include question text if found
        questionOrder: question ? question.questionOrder : null, // Include question order if found
      };
    });

    res.status(200).json({
      status: 'success',
      data: answersWithQuestions,
    });
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};


// Controller to update an existing answer
const updateAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { answer } = req.body;

    // Check if answer is empty
    if (!answer) {
      return res.status(400).json({ error: 'Answer is required' });
    }

    const updatedAnswer = await Answer.findByIdAndUpdate(answerId, { answer }, { new: true });

    if (!updatedAnswer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    res.status(200).json({ status: 200, message: 'Answer updated successfully', data: updatedAnswer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get all answers by user
const getAllAnswersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const answers = await Answer.find({ userId });

    res.status(200).json({ status: 200, data: answers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteAnswer = async (req, res) => {
    try {
      const { answerId } = req.params;
  
      const deletedAnswer = await Answer.findByIdAndDelete(answerId);
  
      if (!deletedAnswer) {
        return res.status(404).json({ error: 'Answer not found' });
      }
  
      res.status(200).json({ status: 200, message: 'Answer deleted successfully', data: deletedAnswer });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = { 
    createAnswer, 
    updateAnswer, 
    getAllAnswersByUser,
    getAnswersByCriteria,
    deleteAnswer
 };
