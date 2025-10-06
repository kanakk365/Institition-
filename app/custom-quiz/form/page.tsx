"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SUBJECT_OPTIONS } from "@/lib/subjects";

interface QuestionOption {
  id: string;
  optionText: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  questionText: string;
  marks: number;
  bloomTaxonomy: string;
  options: QuestionOption[];
}

interface QuizData {
  quizDetails: {
    title: string;
    subject: string;
    topic: string;
    timeLimitMinutes: number;
    instructions: string;
    difficulty: string;
  };
  description: string;
  classSection: {
    standardId: string;
    sectionId: string;
  };
  questions: Question[];
}

const createEmptyOption = (): QuestionOption => ({
  id: crypto.randomUUID(),
  optionText: "",
  isCorrect: false,
});

const createEmptyQuestion = (): Question => ({
  id: crypto.randomUUID(),
  questionText: "",
  marks: 1,
  bloomTaxonomy: "remember",
  options: [createEmptyOption(), createEmptyOption(), createEmptyOption(), createEmptyOption()],
});

export default function CustomQuizFormPage() {
  const router = useRouter();
  const [data, setData] = useState<QuizData>({
    quizDetails: {
      title: "",
      subject: "",
      topic: "",
      timeLimitMinutes: 30,
      instructions: "",
      difficulty: "MEDIUM",
    },
    description: "",
    classSection: { standardId: "", sectionId: "" },
    questions: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("customQuizGradeAndSection");
    const std = sessionStorage.getItem("customQuizSelectedStandard");
    if (stored && std) {
      const parsed = JSON.parse(stored);
      const standard = JSON.parse(std);
      setData((prev) => ({
        ...prev,
        classSection: { standardId: standard.id, sectionId: parsed.section.id },
      }));
    }
  }, []);

  const handleInputChange = (field: keyof QuizData["quizDetails"], value: string | number) => {
    setData((prev) => ({
      ...prev,
      quizDetails: { ...prev.quizDetails, [field]: value },
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const addQuestion = () => {
    setData((prev) => ({
      ...prev,
      questions: [...prev.questions, createEmptyQuestion()],
    }));
  };

  const removeQuestion = (id: string) => {
    setData((prev) => ({
      ...prev,
      questions: prev.questions.filter((question) => question.id !== id),
    }));
  };

  const updateQuestion = (id: string, field: keyof Question, value: string | number | QuestionOption[]) => {
    setData((prev) => ({
      ...prev,
      questions: prev.questions.map((question) => (question.id === id ? { ...question, [field]: value } : question)),
    }));
  };

  const updateOption = (questionId: string, optionId: string, field: keyof QuestionOption, value: string | boolean) => {
    setData((prev) => ({
      ...prev,
      questions: prev.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId ? { ...option, [field]: value } : option,
              ),
            }
          : question,
      ),
    }));
  };

  const handleSubmit = () => {
    setError("");
    setLoading(true);

    if (data.questions.length === 0) {
      setError("Please add at least one question");
      setLoading(false);
      return;
    }

    for (let i = 0; i < data.questions.length; i += 1) {
      const question = data.questions[i];
      if (!question.questionText.trim()) {
        setError(`Question ${i + 1} text is required`);
        setLoading(false);
        return;
      }
      if (!question.options.some((option) => option.isCorrect)) {
        setError(`Question ${i + 1} must have at least one correct answer`);
        setLoading(false);
        return;
      }
      if (question.options.some((option) => !option.optionText.trim())) {
        setError(`Question ${i + 1} has empty options`);
        setLoading(false);
        return;
      }
    }

    sessionStorage.setItem("quizFormData", JSON.stringify(data));

    setLoading(false);
    router.push("/custom-quiz/confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <button type="button" onClick={() => router.back()} className="text-gray-600 mb-4">← Back</button>
            <h1 className="text-2xl font-semibold mb-2">Create Custom Quiz</h1>
            <p className="text-gray-600">Fill in the quiz details below</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="quiz-title" className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
              <Input
                id="quiz-title"
                placeholder="e.g., Mathematics Quiz - Algebra"
                value={data.quizDetails.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="quiz-subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <Select
                value={data.quizDetails.subject || undefined}
                onValueChange={(value) => handleInputChange("subject", value)}
              >
                <SelectTrigger id="quiz-subject" className="w-full bg-white border border-gray-300 h-10">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent className="z-[100] bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                  {SUBJECT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="cursor-pointer hover:bg-gray-100 px-3 py-2">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="quiz-topic" className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <Input
                id="quiz-topic"
                placeholder="e.g., Algebra"
                value={data.quizDetails.topic}
                onChange={(e) => handleInputChange("topic", e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="quiz-time-limit" className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <Input
                id="quiz-time-limit"
                type="number"
                placeholder="30"
                value={data.quizDetails.timeLimitMinutes}
                onChange={(e) => handleInputChange("timeLimitMinutes", parseInt(e.target.value, 10) || 0)}
              />
            </div>

            <div className="relative z-10">
              <label htmlFor="quiz-difficulty" className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <Select value={data.quizDetails.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                <SelectTrigger id="quiz-difficulty" className="w-full bg-white border border-gray-300 h-10">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent className="z-[100] bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                  <SelectItem value="EASY" className="cursor-pointer hover:bg-gray-100 px-3 py-2">Easy</SelectItem>
                  <SelectItem value="MEDIUM" className="cursor-pointer hover:bg-gray-100 px-3 py-2">Medium</SelectItem>
                  <SelectItem value="HARD" className="cursor-pointer hover:bg-gray-100 px-3 py-2">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="quiz-instructions" className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
              <Textarea
                id="quiz-instructions"
                placeholder="Please read all questions carefully..."
                value={data.quizDetails.instructions}
                onChange={(e) => handleInputChange("instructions", e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="quiz-description" className="block text-sm font-medium text-gray-700 mb-2">Note</label>
              <Textarea
                id="quiz-description"
                placeholder="Add any additional notes or description..."
                value={data.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                rows={3}
              />
            </div>

            {/* Questions Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                <Button type="button" onClick={addQuestion} variant="outline">
                  + Add Question
                </Button>
              </div>

              {data.questions.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No questions added yet. Click "Add Question" to start.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {data.questions.map((question, index) => {
                    const questionTextId = `question-${question.id}-text`;
                    const questionMarksId = `question-${question.id}-marks`;

                    return (
                      <div key={question.id} className=" shadow-md rounded-lg p-4 bg-gray-50 relative overflow-visible">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Question {index + 1}</h4>
                          <Button
                            type="button"
                            onClick={() => removeQuestion(question.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 "
                          >
                            Remove
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label htmlFor={questionTextId} className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                            <Textarea
                              id={questionTextId}
                              placeholder="Enter your question here..."
                              value={question.questionText}
                              onChange={(e) => updateQuestion(question.id, "questionText", e.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative z-10">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Bloom's Taxonomy</label>
                              <Select
                                value={question.bloomTaxonomy || "remember"}
                                onValueChange={(value) => updateQuestion(question.id, "bloomTaxonomy", value)}
                              >
                                <SelectTrigger className="w-full bg-white border border-gray-300 h-10">
                                  <SelectValue placeholder="Select Bloom's Taxonomy level" />
                                </SelectTrigger>
                                <SelectContent className="z-[100] bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                                  <SelectItem value="remember">Remember</SelectItem>
                                  <SelectItem value="understand">Understand</SelectItem>
                                  <SelectItem value="apply">Apply</SelectItem>
                                  <SelectItem value="analyze">Analyze</SelectItem>
                                  <SelectItem value="evaluate">Evaluate</SelectItem>
                                  <SelectItem value="create">Create</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <label htmlFor={questionMarksId} className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
                              <Input
                                id={questionMarksId}
                                type="number"
                                placeholder="1"
                                value={question.marks}
                                onChange={(e) => updateQuestion(question.id, "marks", parseInt(e.target.value, 10) || 1)}
                              />
                            </div>
                          </div>

                          <fieldset>
                            <legend className="block text-sm font-medium text-gray-700 mb-2">Options</legend>
                            <div className="space-y-2">
                              {question.options.map((option, optIndex) => {
                                const optionCheckboxId = `question-${question.id}-option-${option.id}-correct`;
                                const optionInputId = `question-${question.id}-option-${option.id}`;

                                return (
                                  <div key={option.id} className="flex items-center gap-3">
                                    <Checkbox
                                      id={optionCheckboxId}
                                      checked={option.isCorrect}
                                      onCheckedChange={(checked) => updateOption(question.id, option.id, "isCorrect", !!checked)}
                                      aria-labelledby={optionInputId}
                                    />
                                    <Input
                                      id={optionInputId}
                                      placeholder={`Option ${optIndex + 1}`}
                                      value={option.optionText}
                                      onChange={(e) => updateOption(question.id, option.id, "optionText", e.target.value)}
                                      className="flex-1"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Check the correct answer(s)</p>
                          </fieldset>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pt-6">
              <Button onClick={() => router.back()} variant="outline">Cancel</Button>
              <Button
                onClick={handleSubmit}
                className="button-primary"
                disabled={loading || !data.quizDetails.title}
              >
                {loading ? "Creating..." : "Create Custom Quiz"}
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
