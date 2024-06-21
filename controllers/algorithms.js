const Question = require('../models/QuestionModel');
const Answer = require('../models/AnswerModel');
const Project = require('../models/ProjectModel');
const Joi = require('joi');



const countTotalQuestionsAnsweredByTypeAndProject = async (req, res) => {
   
    console.log("here algo cont");
    try {

        console.log(req.params);
        const { userId, questionType, projectId } = req.params;
      // Find all answers that match the provided userId, projectId, and include the questionId
      
      const answers = await Answer.find({ userId: userId, projectId: projectId }).select('questionId');

      console.log("answrs");
      console.log(answers);
  
      // Extract distinct questionIds from the answers
      const distinctQuestionIds = [...new Set(answers.map(answer => answer.questionId))];
  
      // Count the distinct questionIds with matching questionType
      let totalCount = 0;
  
      // Iterate through distinct questionIds to get the questionType from the Question model
      for (const questionId of distinctQuestionIds) {
        const question = await Question.findById(questionId);
        if (question && question.questionType === questionType) {
          totalCount++;
        }
      }
  
      console.log(`Total number of questions answered by user '${userId}' with questionType '${questionType}' in project '${projectId}': ${totalCount}`);
      res.json({ status: 200, message: 'Project deleted successfully', data: totalCount });
    
    } catch (error) {
      console.error('Error counting total questions:', error);
      return 0; // Return 0 in case of error
    }
  };
  

  const getTotalQuestionsByType =  async (req, res) => {
    try {
        const { questionType } = req.params;
        // Count the total number of questions with the specified questionType
        const totalCount = await Question.countDocuments({ questionType });
        res.json({ status: 200, message: 'Project deleted successfully', data: totalCount });
    } catch (error) {
        console.error('Error counting total questions:', error);
        return 0; // Return 0 in case of an error
    }
};

module.exports = { 
    countTotalQuestionsAnsweredByTypeAndProject, 
    getTotalQuestionsByType
};
