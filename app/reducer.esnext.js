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
    factor1: 1,
    factor2: 1,
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
    buttonsDisabled: false,
});

export default (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case actions.GENERATE_NUMBERS_SUCCEEDED:
            const {
                factor1,
                factor2,
                result1,
                result2,
                result3,
            } = payload;

            return state.merge({ factor1, factor2,  result1, result2, result3 });


        case actions.SOLVE_REQUESTED:
            const { solution, id } = payload;

            const result1State = id != 1 ? 'info' : (solution != state.factor1 * state.factor2 ? 'danger' : 'success');
            const result2State = id != 2 ? 'info' : (solution != state.factor1 * state.factor2 ? 'danger' : 'success');
            const result3State = id != 3 ? 'info' : (solution != state.factor1 * state.factor2 ? 'danger' : 'success');

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
            return state.merge({
                factor1: payload.factor1,
                factor2: payload.factor2,
                result1: payload.result1,
                result2: payload.result2,
                result3: payload.result3,
                result1State: 'info',
                result2State: 'info',
                result3State: 'info',
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