import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import {
    STEP_START,
    STEP_TASKS,
    STEP_LEVEL_UP,
    STEP_RESULT,
    pointsNeededForLevel,
} from './reducer.esnext';

const Layout  = props => {
    const {
        term1,
        term2,
        result1,
        result2,
        result3,
        result1State,
        result2State,
        result3State,
        step,
        level,
        points,
        life,
        operator,
        buttonsDisabled,

        onStartTasksClick,
        onRestartTasksClick,
        onSolveClick,
    } = props;

    const showTasks = step !== STEP_START && step !== STEP_RESULT;

    return <div>
        <div className="container" role="main">
            { step === STEP_START && <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>Kopf-Rechen-Maschine</h1>
                    <p>
                        <button onClick={onStartTasksClick} type="button" className="btn btn-primary btn-lg">START!</button>
                    </p>
                </div>
            </div> }
            { step === STEP_TASKS && <div>
                <div className="col-md-8">
                    <div className="row">
                        <span className="term">{term1}</span>
                        <span className="operator">{operator}</span>
                        <span className="term">{term2}</span>
                    </div>
                    <div className="row">
                        <button onClick={() => onSolveClick(result1, 1)} type="button" className={"btn btn-lg btn-" + result1State} disabled={buttonsDisabled}>{result1}</button>
                        <button onClick={() => onSolveClick(result2, 2)} type="button" className={"btn btn-lg btn-" + result2State} disabled={buttonsDisabled}>{result2}</button>
                        <button onClick={() => onSolveClick(result3, 3)} type="button" className={"btn btn-lg btn-" + result3State} disabled={buttonsDisabled}>{result3}</button>
                    </div>
                </div>
                <div className="col-md-4 stats">
                    <div className="row">
                        <p><strong>Leben: {_.times(life, (key) => <img key={key} src="heart.png" width="16" height="16" />)}</strong></p>
                        <p><strong>Level: {level}</strong></p>
                        <p>Aktuelle Punktzahl: {points}</p>
                        { level !== 5 && <p>Bis zum nächsten Level: {pointsNeededForLevel[level+1] - points}</p> }
                    </div>
                </div>
            </div> }
            { step === STEP_RESULT && <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>FERTIG</h1>
                    <p>Sehr gut! Du hast <strong>Level {level}</strong> und <strong>{points} Punkte</strong> erreicht!</p>
                    <p>
                        <button onClick={onRestartTasksClick} type="button" className="btn btn-primary btn-lg">Nochmal!</button>
                    </p>
                </div>
            </div> }
            { step === STEP_LEVEL_UP && <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>Neuer Level erreicht!</h1>
                    <p>
                        Super! Du bist auf <strong>Level {level}</strong> aufgestiegen!
                    </p>
                    <p>Hier ist deine Belohnung:<br />
                        <img src="http://random-octocat.herokuapp.com" width="300" height="300" />
                    </p>
                    <p>
                        <button onClick={onStartTasksClick} type="button" className="btn btn-primary btn-lg">Weiter!</button>
                    </p>
                </div>
            </div>}
        </div>
    </div>};

Layout.propTypes = {
    term1: PropTypes.number.isRequired,
    term2: PropTypes.number.isRequired,
    result1: PropTypes.number.isRequired,
    result2: PropTypes.number.isRequired,
    result3: PropTypes.number.isRequired,
    result1State: PropTypes.string.isRequired,
    result2State: PropTypes.string.isRequired,
    result3State: PropTypes.string.isRequired,
    step: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    points: PropTypes.number.isRequired,
    life: PropTypes.number.isRequired,
    operator: PropTypes.string.isRequired,
    buttonsDisabled: PropTypes.bool.isRequired,

    onStartTasksClick: PropTypes.func.isRequired,
    onRestartTasksClick: PropTypes.func.isRequired,
    onSolveClick: PropTypes.func.isRequired,
};

export default actions => {
    const mapStateToProps = state => {
        const {
            term1,
            term2,
            result1,
            result2,
            result3,
            result1State,
            result2State,
            result3State,
            step,
            level,
            points,
            life,
            operator,
            buttonsDisabled,
            } = state;

        return {
            term1,
            term2,
            result1,
            result2,
            result3,
            result1State,
            result2State,
            result3State,
            step,
            level,
            points,
            life,
            operator,
            buttonsDisabled,
        };
    };

    const mapDispatchToProps = dispatch => (
        bindActionCreators({
            onStartTasksClick: actions.requestStartTasks,
            onRestartTasksClick: actions.requestRestartTasks,
            onSolveClick: actions.requestToSolveTask,
        }, dispatch)
    );

    return connect(mapStateToProps, mapDispatchToProps)(Layout);
};