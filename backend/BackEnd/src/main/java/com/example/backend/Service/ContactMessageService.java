package com.example.backend.Service;

import com.example.backend.Entity.ContactMessage;
import com.example.backend.Entity.User;
import com.example.backend.Repository.ContactMessageRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactMessageService {
    private final ContactMessageRepository repo;
    private final JavaMailSender mailSender;

    public ContactMessageService(ContactMessageRepository repo, JavaMailSender mailSender) {
        this.repo = repo;
        this.mailSender = mailSender;
    }

    //send email for admin
    public void sendContactMail(String fullName, String email, String subject, String message, User currentUser) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo("thaiphamhuy3@gmail.com");
        mailMessage.setSubject("Customer message: " + subject);
        mailMessage.setText("From: " + fullName + " (" + email + ")\n\n" + message);
        mailSender.send(mailMessage);

        //Save to database
        ContactMessage contactMessage = new ContactMessage();
        contactMessage.setFullName(fullName);
        contactMessage.setEmail(email);
        contactMessage.setSubject(subject);
        contactMessage.setMessage(message);
        contactMessage.setStatus("UNREAD"); // Set default status

        if (currentUser != null) {
            contactMessage.setUser(currentUser);
        }
        repo.save(contactMessage);
    }

    public List<ContactMessage> getAllContactMessages() {
        return repo.findAll();
    }

    public void markAsRead(Long id) {
        repo.findById(id).ifPresent(contactMessage -> {
            contactMessage.setStatus("READ");
            repo.save(contactMessage);
        });
    }

}
