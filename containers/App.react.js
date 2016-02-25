import React, {
  AppRegistry,  Component, PropTypes,  StyleSheet, Text, 
  View,  Image,  ListView,  Platform,  TouchableHighlight,
} from 'react-native'
import { connect } from 'react-redux'
import { selectSubstory, fetchPostsIfNeeded, invalidatesubreddit } from '../actions/storyAction'
import ListItem from '../components/ListItem.react'
import Picker from '../components/Picker.react'

class App extends Component {
  constructor(props){
    super(props)
    this.handleChange = this._handleChange.bind(this)
  }
  componentDidMount() {
    const { dispatch, selectedSubstory } = this.props
    dispatch(fetchPostsIfNeeded(selectedSubstory))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedSubstory !== this.props.selectedSubstory) {
      const { dispatch, selectedSubstory } = nextProps
      dispatch(fetchPostsIfNeeded(selectedSubstory))
    }
  }

  _handleChange(nextSubstory) {
    this.props.dispatch(selectSubstory(nextSubstory))
  }

  render() {
    const { selectedSubstory, posts, isFetching } = this.props
    let data = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    let dataSource = data.cloneWithRows(posts)
    return (
        <ListView
            dataSource={dataSource}
            renderHeader={ () => (
              <Picker 
                value={selectedSubstory} 
                onPress={this.handleChange}
                options ={[0, 1, 2, 3, 4, 5]}
              />
            )}
            renderRow={ item => (<ListItem rowData={item} />) }
            onEndReachedThreshold={10}
            automaticallyAdjustContentInsets={false}
            showsVerticalScrollIndicator={false} />
    )
  }
}

App.propTypes = {
  selectedSubstory: PropTypes.number.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { selectedSubstory, postsBySubstory } = state
  const {
    isFetching,
    lastUpDated,
    items: posts
  } = postsBySubstory[selectedSubstory] || {
    isFetching: true,
    items: []
  }
  return {
    selectedSubstory,
    posts,
    isFetching,
    lastUpDated
  }
}

export default connect(mapStateToProps)(App)

