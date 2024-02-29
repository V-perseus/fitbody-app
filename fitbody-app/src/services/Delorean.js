//
//        ::::::::: :::::::::::::       :::::::: ::::::::: ::::::::::    :::    ::::    :::
//       :+:    :+::+:       :+:      :+:    :+::+:    :+::+:         :+: :+:  :+:+:   :+:
//      +:+    +:++:+       +:+      +:+    +:++:+    +:++:+        +:+   +:+ :+:+:+  +:+
//     +#+    +:++#++:++#  +#+      +#+    +:++#++:++#: +#++:++#  +#++:++#++:+#+ +:+ +#+
//    +#+    +#++#+       +#+      +#+    +#++#+    +#++#+       +#+     +#++#+  +#+#+#
//   #+#    #+##+#       #+#      #+#    #+##+#    #+##+#       #+#     #+##+#   #+#+#
//  ######### ############################ ###    ################     ######    ####
//
//                   __---~~~~--__                      __--~~~~---__
//                  `\---~~~~~~~~\\                    //~~~~~~~~---/'
//                   \/~~~~~~~~~\||                  ||/~~~~~~~~~\/
//                               `\\                //'
//                                 `\\            //'
//                                   ||          ||      Hey Doc!
//                         ______--~~~~~~~~~~~~~~~~~~--______
//                    ___ //   _-~                        ~-_ \\ ___
//                   `\__)\/~                              ~\/(__/'
//                    _--`-___                            ___-'--_
//                  /~     `\ ~~~~~~~~------------~~~~~~~~ /'     ~\
//                 /|        `\                          /'        |\
//                | `\   ______`\_         DMC        _/'______   /' |
//                |   `\_~-_____\ ~-________________-~ /_____-~_/'   |
//                `.     ~-__________________________________-~     .'
//                 `.      [_______/------|~~|------\_______]      .'
//                  `\--___((____)(________\/________)(____))___--/'
//                   |>>>>>>||                            ||<<<<<<|
//                   `\<<<<</'                            `\>>>>>/'
//
//                      Please use our neat time machine for all
//                      date and time keeping-related operations.
//
//   𝘿𝙤𝙣’𝙩 𝙬𝙤𝙧𝙧𝙮. 𝘼𝙨 𝙡𝙤𝙣𝙜 𝙖𝙨 𝙮𝙤𝙪 𝙝𝙞𝙩 𝙩𝙝𝙖𝙩 𝙬𝙞𝙧𝙚 𝙬𝙞𝙩𝙝 𝙩𝙝𝙚 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙞𝙣𝙜 𝙝𝙤𝙤𝙠 𝙖𝙩 𝙥𝙧𝙚𝙘𝙞𝙨𝙚𝙡𝙮 𝙚𝙞𝙜𝙝𝙩𝙮-𝙚𝙞𝙜𝙝𝙩
//                      𝙢𝙞𝙡𝙚𝙨 𝙥𝙚𝙧 𝙝𝙤𝙪𝙧 𝙩𝙝𝙚 𝙞𝙣𝙨𝙩𝙖𝙣𝙩 𝙩𝙝𝙚 𝙡𝙞𝙜𝙝𝙩𝙣𝙞𝙣𝙜 𝙨𝙩𝙧𝙞𝙠𝙚𝙨 𝙩𝙝𝙚 𝙩𝙤𝙬𝙚𝙧… 𝙚𝙫𝙚𝙧𝙮𝙩𝙝𝙞𝙣𝙜 𝙬𝙞𝙡𝙡 𝙗𝙚 𝙛𝙞𝙣𝙚.

import * as _ from 'lodash';
import moment from 'moment';

import { store } from '../store';

// TODO: optimize this to stash state info / computed vals and only recompute w/ state diff

/**
 * Wrapper for all related methods
 *
 * @param  {String} [date=false]      Defaults to today.
 * @param  {String} [goal=false]      Defaults to the currently set workout goal.
 * @param  {Number} [weekNr=false]    Defaults to the current week number for
 *                                      the goal context.
 * @param  {Boolean} [persist=false]  Some methods will persist changes to API
 *                                      if this is set to true.
 *
 * @return {Object}  Returns Delorean child methods.
 */
const Delorean = function({
  date = false,
  goal = false,
  persist = false,
  weekNr = false
  } = {})
{
  const bail = {
    getWeekNr: () => null,
    getWeekRange: () => null,
    getFirstMonday: () => null,
    getLastSunday: () => null
  };

  let state = store.getState();
  const programList = _.get(state, 'data.user.meta.programs', false);
  if (!goal) {
    goal = _.get(state, 'data.user.workout_goal');
  }
  let signupDate = _.get(state, 'data.user.created_at', false);

  // bail out if any of these aren't present
  if (!state || !programList || !goal || !signupDate) {
    // console.log('Delorean shutting down, crucial properties are missing');
    return bail;
  }

  // now that we've verified presence let's process these variables a bit
  goal = goal.toLowerCase();
  const currentProgram = programList[goal];
  signupDate = moment(signupDate);

  if (!currentProgram || !currentProgram.current_week || !currentProgram.active_week) {
    // console.log('Delorean shutting down, current program properties are missing');
    return bail;
  }

  let today = moment();

  // establish `signupMonday`, the first possible workout date the user can
  // access across all programs
  let signupMonday = moment(signupDate);
  if (signupMonday.format('dddd') === 'Sunday') {
    signupMonday.subtract(6, 'days'); // roll back to Monday of prior week
  } else {
    signupMonday.day(1); // set to Monday
  }

  let highestWeekNr = 0;
  _.each(programList, (program) => {
    if (program.active_week > highestWeekNr) {
      highestWeekNr = program.active_week;
    }
  });

  // establish `maxSunday`, the last possible workout date the user can
  // access across all programs
  let maxSunday = moment(signupMonday);
  maxSunday.add(highestWeekNr, 'weeks');
  maxSunday.day(0); // set to Sunday

  let currentWeek = currentProgram.current_week;
  const maxWeek = currentProgram.active_week;

  // the "current_week" and "active_week" nomenclature is asinine, for
  // clarity's sake please don't reference active_week if at all possible

  // establish `firstMonday`, the first possible workout date the user can
  // access for the current program
  let firstMonday = moment(maxSunday);
  firstMonday.day(1).subtract(maxWeek, 'weeks');

  return {
    /**
     * Returns the workout week number correlating with the given date.
     */
    getWeekNr: function() {
      // TODO: not yet implemented
    },

    /**
     * Returns an array of 7 Moment.js objects corresponding with workout week
     * associated with the date or weekNr.
     */
    getWeekRange: function() {
      // TODO: not yet implemented
    },

    /**
     * Returns the first Monday of a workout week given the parameters supplied.
     * Will use `date` or `weekNr`. If neither are set it will return the first
     * Monday of the first available week.
     */
    getFirstMonday: function() {
      // TODO: support `date` and `weekNr` arguments
      return firstMonday;
    },

    /**
     * Returns the last Sunday of a workout week given the parameters supplied.
     * Will use `date` or `weekNr`. If neither are set it will return the last
     * Sunday of the last available week.
     */
    getLastSunday: function() {
      // TODO: support `date` and `weekNr` arguments
      return maxSunday.day(7);
    }
  };
};

export default Delorean;
