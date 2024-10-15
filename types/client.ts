
export type LevelState = {
    progress: number,
    answeredQuestions: number,
    totalQuestions: number,
    correctQuestions: number;
    xp: number,
    currentQuestionIndex: number,
    seconds: number,
}

export type QuestionState = {
    options: string[],
    selected: string,
    correct: "correct" | "wrong" | "initial"
}

export type OptionState = "selected" | "unselected" | "correct" | "wrong"