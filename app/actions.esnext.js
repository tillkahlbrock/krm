export const SOLVE_REQUESTED = 'solve requested';
export const GENERATE_INITIAL_TASKS_SUCCEEDED = 'generate initial tasks succeeded';
export const TASK_SOLVED_TIMEOUT_FINISHED = 'task solved timeout finished';
export const START_TASKS_REQUESTED = 'start tasks requested';
export const RESTART_TASKS_REQUESTED = 'restart tasks requested';

const DELAY_BEFORE_NEXT_TASK = 2000;
const OPERATOR_ADDITION = '+';
const OPERATOR_SUBSTRACTION = '-';
const OPERATOR_MULTIPLICATION = '*';

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const tasks = (level, operator) => {
    if (level === 1) {
        return levelOneTasks(operator);
    }

    if (level === 2) {
        return levelTwoTasks(operator);
    }

    return levelThreeTasks();
};

const hasCarry = (term1, term2, operator) => {
    switch (operator) {
        case OPERATOR_ADDITION:
            return (firstDigit(term1) + firstDigit(term2)) >= 10;
        case OPERATOR_SUBSTRACTION:
            return firstDigit(term1) < firstDigit(term2);
    }
};

const firstDigit = number => {
    if (number < 10) {
        return number;
    }

    return firstDigit(number - 10);
};

const levelOneTasks = operator => {
    let term1, term2;
    let notDone = true;

    const result1 = randomNumber(1, 100);
    const result2 = randomNumber(1, 100);
    const result3 = randomNumber(1, 100);

    while (notDone) {
        term1 = randomNumber(1, 100);
        term2 = randomNumber(1, 100);

        if (hasCarry(term1, term2, operator)) {
            continue;
        }

        notDone = term1 + term2 !== result1 &&
            term1 + term2 !== result2 &&
            term1 + term2 !== result3;
    }

    return {
        term1,
        term2,
        result1,
        result2,
        result3,
    };
};

const levelTwoTasks = operator => {
    let term1, term2;
    let notDone = true;

    const result1 = randomNumber(1, 50);
    const result2 = randomNumber(1, 50);
    const result3 = randomNumber(1, 50);

    while (notDone) {
        term1 = randomNumber(1, 100);
        term2 = randomNumber(1, 100);

        if (term1 <= term2) {
            continue;
        }

        if (hasCarry(term1, term2, operator)) {
            continue;
        }

        notDone = term1 - term2 !== result1 &&
            term1 - term2 !== result2 &&
            term1 - term2 !== result3;
    }

    return {
        term1,
        term2,
        result1,
        result2,
        result3,
    };
};

const levelThreeTasks = () => {
    let term1, term2;
    let notDone = true;

    const result1 = randomNumber(1, 10) * randomNumber(1, 10);
    const result2 = randomNumber(1, 10) * randomNumber(1, 10);
    const result3 = randomNumber(1, 10) * randomNumber(1, 10);

    while (notDone) {
        term1 = randomNumber(1, 10);
        term2 = randomNumber(1, 10);
        notDone = term1 * term2 !== result1 &&
            term1 * term2 !== result2 &&
            term1 * term2 !== result3;
    }

    return {
        term1,
        term2,
        result1,
        result2,
        result3,
    };
};

export const operatorForLevel = level => {
    switch (level) {
        case 1:
            return OPERATOR_ADDITION;
        case 2:
            return OPERATOR_SUBSTRACTION;
        case 3:
            return OPERATOR_MULTIPLICATION;
        default:
            return OPERATOR_ADDITION;
    }
};

export const requestStartTasks = () => dispatch => {
    dispatch({ type: START_TASKS_REQUESTED });
};

export const requestRestartTasks = () => dispatch => {
    dispatch({ type: RESTART_TASKS_REQUESTED });
};

export const requestToSolveTask = (proposedSolution, taskId) => (dispatch, getState) => {
    const state = getState();
    const level = state.level;
    const operator = operatorForLevel(level);

    setTimeout(() => dispatch(
            {
                type: TASK_SOLVED_TIMEOUT_FINISHED,
                payload: {
                    task: tasks(level, operator),
                    operator,
                },
            }
        ),
        DELAY_BEFORE_NEXT_TASK
    );

    const solution = eval(state.term1 + state.operator + state.term2);

    dispatch({ type: SOLVE_REQUESTED, payload: resultStates(proposedSolution, taskId, solution) });
};

const resultStates = (proposedSolution, taskId, solution) => {
    const result1State = taskId != 1 ? 'info' : (proposedSolution != solution ? 'danger' : 'success');
    const result2State = taskId != 2 ? 'info' : (proposedSolution != solution ? 'danger' : 'success');
    const result3State = taskId != 3 ? 'info' : (proposedSolution != solution ? 'danger' : 'success');

    return {
        result1State,
        result2State,
        result3State,
    };
};

export const generateInitialTasksRequested = () => (dispatch, getState) => {
    const level = getState().level;
    dispatch({
        type: GENERATE_INITIAL_TASKS_SUCCEEDED,
        payload: {
            task: tasks(level, OPERATOR_ADDITION),
            operator: OPERATOR_ADDITION,
        },
    });
};
