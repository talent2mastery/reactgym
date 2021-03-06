'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import LocalStorageUtil from '../utils/LocalStorageUtil.js';
import Immutable from 'immutable';
import assign from 'object-assign';
import StoreListenerMixin from '../mixins/StoreListenerMixin.js';

let _exercises = Immutable.List();

let ExerciseStore = assign({}, StoreListenerMixin, {
    getExerciseForId(id) {
        return this.getExercises().filter((exercise) => {
            return exercise.get('id') == id;
        }).first();
    },

    getExercises() {
        if (_exercises.size === 0) {
            _exercises = Immutable.fromJS(LocalStorageUtil.lsGet('exercises'));
        }
        return _exercises;
    }
});

ExerciseStore.dispatchToken = AppDispatcher.register((payload) => {
    let action = payload.action;

    switch (action.type) {
        case ActionTypes.RESTORE_EXERCISES:
            _exercises = Immutable.fromJS(action.data);
            LocalStorageUtil.lsSet('exercises', _exercises);
            ExerciseStore.emitChange();
            break;
        case ActionTypes.GET_EXERCISES:
            var exercises = LocalStorageUtil.lsGet('exercises');
            if (exercises == null) {
                _exercises = Immutable.fromJS([
                    {
                        id: '1',
                        label: 'T-Bar-Rows'
                    },
                    {
                        id: '2',
                        label: 'Hammercurls'
                    },
                    {
                        id: '3',
                        label: 'Butterfly'
                    },
                    {
                        id: '4',
                        label: 'Situps'
                    },
                    {
                        id: '5',
                        label: 'Situps Side'
                    },
                    {
                        id: '6',
                        label: 'Benchpress'
                    },
                    {
                        id: '7',
                        label: 'Chin Ups'
                    },
                    {
                        id: '8',
                        label: 'Pull Ups'
                    },
                    {
                        id: '9',
                        label: 'Calf Raises'
                    },
                    {
                        id: '10',
                        label: 'Leg Press'
                    },
                    {
                        id: '11',
                        label: 'Hyperextensions'
                    },
                    {
                        id: '12',
                        label: 'Shoulder Press'
                    },
                    {
                        id: '13',
                        label: 'Lateral Raises'
                    },
                    {
                        id: '14',
                        label: 'French Press'
                    }
                ]);
                LocalStorageUtil.lsSet('exercises', _exercises);
                ExerciseStore.emitChange();
            }
            break;
        case ActionTypes.ADD_EXERCISE:
            _exercises = _exercises.push(Immutable.Map({
                    id: _exercises.reduce((a, i) => i.get('id'), 0) + 1,
                    label: action.exercise
                }));
            LocalStorageUtil.lsSet('exercises', _exercises);
            ExerciseStore.emitChange();
            break;
        case ActionTypes.UPDATE_EXERCISE:
            var exercise = Immutable.Map(action.exercise);
            _exercises = _exercises.map((item) => {
                if (exercise.get('id') === item.get('id')) {
                    return exercise;
                }
                return item;
            });
            LocalStorageUtil.lsSet('exercises', _exercises);
            ExerciseStore.emitChange();
            break;
        case ActionTypes.REMOVE_EXERCISE:
            _exercises = _exercises.splice(action.index, 1);
            LocalStorageUtil.lsSet('exercises', _exercises);
            ExerciseStore.emitChange();
            break;
        default:
    }
});

module.exports = ExerciseStore;
