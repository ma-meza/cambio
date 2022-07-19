import ReactGA from "react-ga";
ReactGA.initialize('UA-180599599-1');

/**
 * Event - Add custom tracking event.
 * @param {string} category
 * @param {string} action
 * @param {string} label
 */
export default Event = (category, action, label) => {
    ReactGA.event({
        category: category,
        action: action,
        label: label
    });
};
