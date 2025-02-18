import React, { useState } from 'react'
import { Dialog, useMediaQuery } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'

import useStyles from '@hooks/useStyles'
import { useStore, useStatic } from '@hooks/useStore'
import FloatingBtn from './FloatingBtn'
import Sidebar from './drawer/Drawer'
import FilterMenu from './dialogs/filters/Menu'
import UserOptions from './dialogs/UserOptions'
import Tutorial from './dialogs/tutorial/Tutorial'
import UserProfile from './dialogs/UserProfile'
import Search from './dialogs/Search'

const searchable = ['quests', 'pokestops', 'raids', 'gyms', 'portals', 'nests']

export default function Nav({ map, setManualParams }) {
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))
  const { perms } = useStatic(state => state.auth)
  const filters = useStore(state => state.filters)
  const setFilters = useStore(state => state.setFilters)
  const userSettings = useStore(state => state.userSettings)
  const setUserSettings = useStore(state => state.setUserSettings)
  const tutorial = useStore(state => state.tutorial)
  const setTutorial = useStore(state => state.setTutorial)
  const [drawer, setDrawer] = useState(false)
  const [dialog, setDialog] = useState({
    open: false,
    category: '',
    type: '',
  })
  const [userProfile, setUserProfile] = useState(false)
  const safeSearch = searchable.filter(category => perms[category])

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setDrawer(open)
  }

  const toggleDialog = (open, category, type, filter) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    if (open) {
      setDialog({ open, category, type })
    } else {
      setDialog({ open, category, type })
    }
    if (filter && type === 'search') {
      map.flyTo([filter.lat, filter.lon], 16)
      setManualParams(filter)
    }
    if (filter && type === 'filters') {
      setFilters({ ...filters, [category]: { ...filters[category], filter } })
    }
    if (filter && type === 'options') {
      setUserSettings({ ...userSettings, [category]: filter })
    }
  }
  return (
    <>
      {userProfile ? (
        <Dialog open={userProfile} fullWidth>
          <UserProfile setUserProfile={setUserProfile} />
        </Dialog>
      ) : (
        <Dialog
          open={tutorial}
        >
          <Tutorial setUserProfile={setUserProfile} setTutorial={setTutorial} toggleDialog={toggleDialog} />
        </Dialog>
      )}
      {drawer ? (
        <Sidebar
          drawer={drawer}
          toggleDrawer={toggleDrawer}
          filters={filters}
          setFilters={setFilters}
          toggleDialog={toggleDialog}
        />
      ) : (
        <FloatingBtn
          toggleDrawer={toggleDrawer}
          toggleDialog={toggleDialog}
          safeSearch={safeSearch}
          isMobile={isMobile}
        />
      )}
      <Dialog
        fullWidth
        maxWidth="md"
        open={dialog.open && dialog.type === 'filters'}
        onClose={toggleDialog(false, dialog.category, dialog.type)}
      >
        <FilterMenu
          toggleDialog={toggleDialog}
          filters={filters[dialog.category]}
          category={dialog.category}
        />
      </Dialog>
      <Dialog
        maxWidth="sm"
        open={dialog.open && dialog.type === 'options'}
        onClose={toggleDialog(false, dialog.category, dialog.type)}
      >
        <UserOptions
          toggleDialog={toggleDialog}
          category={dialog.category}
        />
      </Dialog>
      <Dialog
        classes={{
          scrollPaper: classes.scrollPaper,
          container: classes.container,
        }}
        open={dialog.open && dialog.type === 'search'}
        onClose={toggleDialog(false, dialog.category, dialog.type)}
      >
        <Search
          toggleDialog={toggleDialog}
          safeSearch={safeSearch}
          isMobile={isMobile}
        />
      </Dialog>
    </>
  )
}
