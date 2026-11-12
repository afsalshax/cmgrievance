import { useState } from "react";

import {
    Box,
    Container,
    Typography,
    Accordion,
    AccordionGroup,
    AccordionDetails,
    AccordionSummary,
    Card
} from "@mui/joy";

import Navbar from "../../components/public/Navbar";

const faqData = [
    {
        question: "What is the CM Kerala Grievance Portal?",
        answer: "It is a digital platform prototype that demonstrates how citizens can submit public grievances, track their progress and receive resolution updates."
    },
    {
        question: "How can I submit a grievance?",
        answer: "Register as a citizen, log in to your account, navigate to Submit Grievance, complete the required details and submit your complaint."
    },
    {
        question: "Do I need an account to submit a grievance?",
        answer: "Yes. You need to register and log in as a citizen before submitting a grievance."
    },
    {
        question: "How can I track my grievance?",
        answer: "Use the Track Grievance page and enter the unique reference number provided after successful submission."
    },
    {
        question: "Will I receive a reference number?",
        answer: "Yes. Every successfully submitted grievance receives a unique reference number that you can use to track its progress."
    },
    {
        question: "Can I upload supporting documents?",
        answer: "Yes. You can upload up to three supporting files in JPG, PNG, WEBP, PDF or Word format, with a maximum size of 5 MB per file."
    },
    {
        question: "What are the possible grievance statuses?",
        answer: "The available statuses are Submitted, Under Review, In Progress, Resolved and Reopened."
    },
    {
        question: "How long does grievance resolution take?",
        answer: "Resolution time depends on the nature and complexity of the complaint and the action required from the concerned department."
    },
    {
        question: "Can I provide feedback after resolution?",
        answer: "Yes. Once a grievance is marked as Resolved, you can submit a rating and comments through the tracking page."
    },
    {
        question: "What does the AI assistant do?",
        answer: "The AI assistant provides preliminary complaint summaries, suggested departments, categories and priority levels. These are recommendations only and require human review."
    }
];

const FAQ = () => {
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#F7F9FC" }}>
            <Navbar />

            {/* Header */}
            <Box
                sx={{
                    bgcolor: "#102A43",
                    py: 7,
                    textAlign: "center",
                    px: 2
                }}
            >
                <Container>
                    <Typography level="h1" sx={{ color: "white", mb: 2 }}>
                        Frequently Asked Questions
                    </Typography>

                    <Typography sx={{ color: "#DCE6F2" }}>
                        Find answers to common questions about the grievance portal.
                    </Typography>
                </Container>
            </Box>

            {/* FAQ Section */}
            <Container maxWidth="md" sx={{ py: 7 }}>
                <Card variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: "lg" }}>
                    <Typography level="h3" sx={{ mb: 3 }}>
                        General Questions
                    </Typography>

                    <AccordionGroup
                        sx={{
                            "--AccordionGroup-gap": "12px",
                            "--Accordion-radius": "md"
                        }}
                    >
                        {faqData.map((faq, index) => (
                            <Accordion key={index}>
                                <AccordionSummary>
                                    <Typography level="title-md">
                                        {faq.question}
                                    </Typography>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <Typography
                                        level="body-md"
                                        color="neutral"
                                        sx={{ lineHeight: 1.8 }}
                                    >
                                        {faq.answer}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </AccordionGroup>
                </Card>
            </Container>

            {/* Footer */}
            <Box
                sx={{
                    bgcolor: "#10243E",
                    textAlign: "center",
                    py: 3,
                    px: 2
                }}
            >
                <Typography sx={{ color: "white" }}>
                    CM Kerala – Public Grievance Redressal Portal
                </Typography>

                <Typography level="body-xs" sx={{ color: "#CBD5E1", mt: 1 }}>
                    Recruitment prototype. Not an official Government of Kerala website.
                </Typography>
            </Box>
        </Box>
    );
};

export default FAQ;