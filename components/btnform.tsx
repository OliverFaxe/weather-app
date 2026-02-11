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

    const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem("Latitude", e.target.value)
  }

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem("Longitude", e.target.value)
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
            <Input id="width" defaultValue="55.60" onChange={handleLatitudeChange}/>
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="longitude" className="w-1/2">
              Longitude
            </FieldLabel>
            <Input id="height" defaultValue="13.00" onChange={handleLongitudeChange}/>
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  )
}
