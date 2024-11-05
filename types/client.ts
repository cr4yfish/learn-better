
export type LevelState = {
    progress: number,
    answeredQuestions: number,
    totalQuestions: number,
    correctQuestions: number;
    xp: number,
    currentQuestionIndex: number,
    seconds: number,
    rankUp: boolean,
    questions: {
        id: string;
        completed: boolean;
    }[]
}

export type Correct = "correct" | "wrong" | "initial"

export type QuestionState = {
    options: string[],
    answers: string[],
    selected: string[],
    correct: Correct
}

export type Match = {
    option: string,
    match: string,
    correct: Correct
}

export type MatchCardsState = {
    options: string[],
    matches: Match[],
}


export type FillBlankState = {
    selected: {
        word: string,
        index: number
    }[],
    nextIndex: number,
}

export type OptionState = "selected" | "unselected" | "correct" | "wrong"