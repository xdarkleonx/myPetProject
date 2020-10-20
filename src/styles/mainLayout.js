import { StyleSheet } from 'react-native';

export const mainLayout = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#f7f7f7'
  },
  imageBackground: {
    width: '100%',
    height: 225,
    backgroundColor: '#141414'
  },
  progressScroll: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  headCenterContainer: {
    height: 96,
    marginTop: 39,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  progressBox: {
    marginHorizontal: 12
  },
  progressTitle: {
    fontSize: 13,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingBottom: 4,
  },
  qualityContainer: {
    paddingTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  qualityText: {
    fontSize: 13,
    color: 'white',
    fontWeight: 'bold',
  },
  progressValue: {
    color: '#4f6488',
    fontWeight: 'bold',
    marginTop: 3,
  },
  progressMeasure: {
    color: '#4f6488',
    fontSize: 12,
    marginTop: -5,
  },
  headBottomContainer: {
    height: 70,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateFont: {
    flex: 1,
    width: 215,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: 18,
  },
  templateFont: {
    color: 'white',
    fontSize: 14,
    marginHorizontal: 4,
    paddingVertical: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2566d4',
    elevation: 2,
  },
  empty: {
    textAlign: 'center',
    padding: 20,
  },
  warnWhite: { 
    color: 'white' 
  }
})