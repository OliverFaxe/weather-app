'use client'
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
export function PopoverForm() {

  const [latitude, setLatitude] = useState("55.60")
  const [longitude, setLongitude] = useState("13.00")

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLatitude(e.target.value) // Save to state, not localStorage yet
  }

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLongitude(e.target.value) // Save to state, not localStorage yet
  }

  function updateCoordinates() {
    // Now save both values when Save button is clicked
    localStorage.setItem("Latitude", latitude)
    localStorage.setItem("Longitude", longitude)
    window.location.reload() // Refresh to fetch new weather data
  }


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Change Coordinates</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <PopoverHeader>
          <PopoverTitle>Where?</PopoverTitle>
          <PopoverDescription>
            Fetch weather data form these coordinates:
          </PopoverDescription>
        </PopoverHeader>
        <FieldGroup className="gap-4">
          <Field orientation="horizontal">
            <FieldLabel htmlFor="latitude" className="w-1/2">
              Latitude
            </FieldLabel>
            <Input id="latitude" value={latitude} onChange={handleLatitudeChange}/>
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="longitude" className="w-1/2">
              Longitude
            </FieldLabel>
            <Input id="longitude" value={longitude} onChange={handleLongitudeChange}/>
          </Field>
          <Button onClick={updateCoordinates} className="w-full mt-2">
            Save
          </Button>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  )
}
