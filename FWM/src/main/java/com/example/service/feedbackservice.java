package com.example.service;

import java.util.List;

import com.example.dto.feedbackdto;

public interface feedbackservice {
	feedbackdto createfeedback(feedbackdto feedback);
	feedbackdto getfeedbackById(Long id);
	List<feedbackdto> getAllfeedback();
	feedbackdto updatefeedback(Long id, feedbackdto feedback);
	void deletefeedback(Long id);
}
