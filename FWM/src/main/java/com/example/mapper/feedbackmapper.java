package com.example.mapper;
import com.example.dto.feedbackdto;
import com.example.entity.feedback;

public class feedbackmapper {
	public static feedbackdto mapTofeedbackdto(feedback feedback)
	{
		return new feedbackdto(
				
				feedback.getReviewerId(),
				feedback.getDonorId(),
				feedback.getRecyclingCenterId(),
				feedback.getRating(),
				feedback.getComments(),
				feedback.getReviewDate(),
				feedback.getPhoto()
				);
	}
	public static feedback mapTofeedback(feedbackdto feedbackdto)
	{
		return new feedback(
				
				feedbackdto.getReviewerId(),
				feedbackdto.getDonorId(),
				feedbackdto.getRecyclingCenterId(),
				feedbackdto.getRating(),
				feedbackdto.getComments(),
				feedbackdto.getReviewDate(),
				feedbackdto.getPhoto()
				);
	}

}
