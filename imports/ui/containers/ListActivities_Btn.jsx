import { withTracker } from 'meteor/react-meteor-data'
import ListActivities_Btn from '../components/ListActivities_Btn.jsx'
import { showActivities_getState,
    showActivities_toggle,
} from '../helpers/showActivities'


export default withTracker( (props) => {

    return {
        handleToggle: showActivities_toggle,
        open: showActivities_getState(),
        ...props,
    }
})(ListActivities_Btn)
