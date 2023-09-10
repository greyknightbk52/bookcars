import React, { useState, useEffect } from 'react'
import { strings as commonStrings } from '../lang/common'
import { strings } from '../lang/home'
import * as UserService from '../services/UserService'
import LocationSelectList from './LocationSelectList'
import DateTimePicker from './DateTimePicker'
import { FormControl, Button } from '@mui/material'
import * as bookcarsTypes from 'bookcars-types'

import '../assets/css/car-filter.css'

const CarFilter = (
  {
    from: filterFrom,
    to: filterTo,
    pickupLocation: filterPickupLocation,
    dropOffLocation: filterDropOffLocation,
    className,
    onSubmit
  }: {
    from: Date
    to: Date
    pickupLocation: bookcarsTypes.Location
    dropOffLocation: bookcarsTypes.Location
    className?: string
    onSubmit: bookcarsTypes.CarFilterSubmitEvent
  }) => {
  const [from, setFrom] = useState<Date>(filterFrom)
  const [to, setTo] = useState<Date>(filterTo)
  const [minDate, setMinDate] = useState<Date>()
  const [pickupLocation, setPickupLocation] = useState<bookcarsTypes.Location | null | undefined>(filterPickupLocation)
  const [dropOffLocation, setDropOffLocation] = useState<bookcarsTypes.Location | null | undefined>(filterDropOffLocation)
  const [sameLocation, setSameLocation] = useState(filterPickupLocation === filterDropOffLocation)

  useEffect(() => {
    if (filterFrom) {
      const minDate = new Date(filterFrom)
      minDate.setDate(filterFrom.getDate() + 1)
      setMinDate(minDate)
    }
  }, [filterFrom])

  const handlePickupLocationChange = (values: bookcarsTypes.Option[]) => {
    const pickupLocation = (values.length > 0 && values[0]) || null

    setPickupLocation(pickupLocation)

    if (sameLocation) {
      setDropOffLocation(pickupLocation)
    }
  }

  const handleSameLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameLocation(e.target.checked)

    if (e.target.checked) {
      setDropOffLocation(pickupLocation)
    }
  }

  const handleSameLocationClick = (e: React.MouseEvent<HTMLElement>) => {
    const checked = !sameLocation

    setSameLocation(checked)
    const checkbox = e.currentTarget.previousSibling as HTMLInputElement
    checkbox.checked = checked

    if (checked) {
      setDropOffLocation(pickupLocation)
    }
  }

  const handleDropOffLocationChange = (values: bookcarsTypes.Option[]) => {
    setDropOffLocation((values.length > 0 && values[0]) || null)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!pickupLocation || !dropOffLocation) {
      return
    }

    if (onSubmit) {
      onSubmit({ pickupLocation, dropOffLocation, from, to })
    }
  }

  return (
    <div className={`${className ? `${className} ` : ''}car-filter`}>
      <form onSubmit={handleSubmit} className="home-search-form">
        <FormControl fullWidth className="pickup-location">
          <LocationSelectList
            label={commonStrings.PICKUP_LOCATION}
            hidePopupIcon
            customOpen
            required
            variant="standard"
            value={pickupLocation as bookcarsTypes.Location}
            onChange={handlePickupLocationChange}
          />
        </FormControl>
        {!sameLocation && (
          <FormControl fullWidth className="drop-off-location">
            <LocationSelectList
              label={commonStrings.DROP_OFF_LOCATION}
              value={dropOffLocation as bookcarsTypes.Location}
              hidePopupIcon
              customOpen
              required
              variant="standard"
              onChange={handleDropOffLocationChange}
            />
          </FormControl>
        )}
        <FormControl fullWidth className="from">
          <DateTimePicker
            label={commonStrings.FROM}
            value={from}
            minDate={new Date()}
            variant="standard"
            required
            onChange={(from) => {
              const minDate = new Date(from)
              minDate.setDate(from.getDate() + 1)

              setFrom(from)
              setMinDate(minDate)
            }}
            language={UserService.getLanguage()}
          />
        </FormControl>
        <FormControl fullWidth className="to">
          <DateTimePicker
            label={commonStrings.TO}
            value={to}
            minDate={minDate}
            variant="standard"
            required
            onChange={(to) => {
              setTo(to)
            }}
            language={UserService.getLanguage()}
          />
        </FormControl>
        <FormControl fullWidth className="search">
          <Button type="submit" variant="contained" className="btn-search">
            {commonStrings.SEARCH}
          </Button>
        </FormControl>
        <FormControl fullWidth className="chk-same-location">
          <input type="checkbox" checked={sameLocation} onChange={handleSameLocationChange} />
          <label onClick={handleSameLocationClick}>{strings.DROP_OFF}</label>
        </FormControl>
      </form>
    </div>
  )
}

export default CarFilter