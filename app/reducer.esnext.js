import immutable from 'seamless-immutable';
import * as actions from './actions.esnext';

export const STEP_START = 0;
export const STEP_TASKS = 10;
export const STEP_LEVEL_UP = 99998;
export const STEP_RESULT = 99999;
export const pointsNeededForLevel = {
    1: 0,
    2: 10,
    3: 20,
    4: 30,
    5: 40,
};

const initialState = immutable({
    term1: 1,
    term2: 1,
    result1: 1,
    result2: 1,
    result3: 1,
    result1State: 'info',
    result2State: 'info',
    result3State: 'info',
    step: STEP_START,
    level: 1,
    points: 0,
    life: 3,
    operator: null,
    buttonsDisabled: false,
});

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case actions.GENERATE_INITIAL_TASKS_SUCCEEDED:
            const {
                term1,
                term2,
                result1,
                result2,
                result3,
            } = payload.task;

            return state.merge({ term1, term2,  result1, result2, result3, operator: payload.operator });


        case actions.SOLVE_REQUESTED:
            const { result1State, result2State, result3State } = payload;

            const success = (result1State == 'success' || result2State == 'success' || result3State == 'success');
            const points = success ? state.points + 1 : state.points;
            const life = success ? state.life : state.life - 1;
            const level = state.level === 5 || points < pointsNeededForLevel[state.level + 1] ? state.level : state.level + 1;
            const step = level !== state.level ? STEP_LEVEL_UP : (life > 0 ? state.step : STEP_RESULT);

            return state.merge({
                result1State,
                result2State,
                result3State,
                step,
                points,
                buttonsDisabled: true,
                level,
                life,
            });

        case actions.TASK_SOLVED_TIMEOUT_FINISHED:
            const task = payload.task;

            return state.merge({
                term1: task.term1,
                term2: task.term2,
                result1: task.result1,
                result2: task.result2,
                result3: task.result3,
                result1State: 'info',
                result2State: 'info',
                result3State: 'info',
                operator: payload.operator,
                buttonsDisabled: false,
            });

        case actions.RESTART_TASKS_REQUESTED:
            return state.merge({
                level: 1,
                life: 3,
                points: 0,
                step: STEP_TASKS,
            });

        case actions.START_TASKS_REQUESTED:
            return state.merge({ step: STEP_TASKS });

        default:
            return state;
    }
}