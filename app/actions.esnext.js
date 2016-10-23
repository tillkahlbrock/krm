export const SOLVE_REQUESTED = 'solve requested';
export const GENERATE_NUMBERS_SUCCEEDED = 'generate numbers succeeded';
export const TASK_SOLVED_TIMEOUT_FINISHED = 'task solved timeout finished';
export const START_TASKS_REQUESTED = 'start tasks requested';
export const RESTART_TASKS_REQUESTED = 'restart tasks requested';

const DELAY_BEFORE_NEXT_TASK = 2000;

const randomNumber = (min = 1, max = 10) => Math.floor(Math.random() * (max - min + 1)) + min;

const numbers = () => {
    let factor1, factor2;
    let notDone = true;

    const result1 = randomNumber() * randomNumber();
    const result2 = randomNumber() * randomNumber();
    const result3 = randomNumber() * randomNumber();

    while (notDone) {
        factor1 = randomNumber();
        factor2 = randomNumber();
        notDone = factor1 * factor2 !== result1 &&
            factor1 * factor2 !== result2 &&
            factor1 * factor2 !== result3;
    }

    return {
        factor1,
        factor2,
        result1,
        result2,
        result3,
    };
};

export const requestStartTasks = () => dispatch => {
    dispatch({ type: START_TASKS_REQUESTED });
};

export const requestRestartTasks = () => dispatch => {
    dispatch({ type: RESTART_TASKS_REQUESTED });
};

export const requestToSolveTask = (solution, id) => (dispatch) => {
    setTimeout(() => dispatch(
            {
                type: TASK_SOLVED_TIMEOUT_FINISHED,
                payload: numbers(),
            }
        ),
        DELAY_BEFORE_NEXT_TASK
    );

    dispatch({ type: SOLVE_REQUESTED, payload: { solution, id } });
};

export const generateNumbersSucceeded = () => (dispatch) => {
    dispatch({ type: GENERATE_NUMBERS_SUCCEEDED, payload: numbers() });
};