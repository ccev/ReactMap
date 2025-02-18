import React, { useState } from 'react'
import {
  Grid, DialogContent, Typography, Fab, Divider, Button,
} from '@material-ui/core'
import { Menu, Settings } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'

import { useStatic } from '@hooks/useStore'
import WithSubItems from '@components/layout/drawer/WithSubItems'
import data from './data.json'

export default function TutSidebar({ toggleDialog, isMobile }) {
  const { t } = useTranslation()
  const [tempFilters, setTempFilters] = useState(data.filters)
  const { perms } = useStatic(state => state.auth)

  const permCheck = perms.pokestops || perms.invasions || perms.quests || perms.lures

  return (
    <DialogContent>
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="center"
        spacing={2}
      >
        <Grid item xs={8}>
          <Typography variant={isMobile ? 'subtitle2' : 'h6'} align="center">
            {t('tutorialSidebar0')}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Fab color="primary">
            <Menu />
          </Fab>
        </Grid>
        <Grid item xs={12}>
          <Divider light />
        </Grid>
        <Grid item xs={12} style={{ whiteSpace: 'pre-line' }}>
          <Typography variant="subtitle1" align="center" gutterBottom>
            {t('tutorialSidebar1')}
          </Typography>
        </Grid>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="center"
          alignItems="center"
          style={{
            width: 300,
            border: 'black 4px solid',
            borderRadius: 20,
            margin: 10,
          }}
        >
          {Object.keys(tempFilters.pokestops).map(subItem => {
            if (subItem === 'filter') {
              return null
            }
            return (
              <WithSubItems
                key={subItem}
                category="pokestops"
                filters={tempFilters}
                setFilters={setTempFilters}
                subItem={subItem}
              />
            )
          })}
          <Grid item xs={6} style={{ textAlign: 'center' }}>
            <Button
              onClick={toggleDialog(true, 'pokestops', 'options')}
              variant="contained"
              color="secondary"
              startIcon={<Settings style={{ color: 'white' }} />}
            >
              {t('options')}
            </Button>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'center' }}>
            <Button
              onClick={toggleDialog(true, 'pokestops', 'filters')}
              variant="contained"
              color="primary"
              disabled={!permCheck}
            >
              {t('advanced')}
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ whiteSpace: 'pre-line' }}>
          <Typography variant="subtitle1" align="center" gutterBottom>
            {t('tutorialSidebar2')}
          </Typography>
        </Grid>
      </Grid>
    </DialogContent>
  )
}
