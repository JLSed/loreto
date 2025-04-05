import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'

export interface Region {
  code: string
  name: string
  regionName: string
  islandGroupCode: string
  psgc10DigitCode: string
}

export interface City {
  code: string
  name: string
  oldName: string
  isCapital: boolean
  provinceCode: string
  districtCode: boolean
  regionCode: string
  islandGroupCode: string
  psgc10DigitCode: string
}

export interface Barangay {
  code: string
  name: string
  oldName: string
  subMunicipalityCode: boolean
  cityCode: boolean
  municipalityCode: string
  districtCode: boolean
  provinceCode: string
  regionCode: string
  islandGroupCode: string
  psgc10DigitCode: string
}

interface Options {
  onFullAddressChange?: (fullAddress: string) => void
}

export default function usePhAddressQuery(options: Options = {}) {
  const [selectedRegion, setSelectedRegion] = useState<Region | undefined>(
    undefined
  )
  const regionsQuery = useQuery({
    queryKey: ['regions'],
    queryFn: () => {
      return axios.get<Region[]>('https://psgc.gitlab.io/api/regions/')
    },
  })

  const regions = regionsQuery.data?.data ?? []
  const findRegionByCode = (code: string) =>
    regions.find((r) => r.code === code)
  const setRegionByCode = (code: string) =>
    setSelectedRegion(findRegionByCode(code))

  const [selectedCity, setSelectedCity] = useState<City | undefined>(undefined)
  const citiesQuery = useQuery({
    queryKey: ['cities', selectedRegion?.code],
    enabled: !!selectedRegion?.code,
    queryFn: () => {
      return axios.get<City[]>(
        `https://psgc.gitlab.io/api/regions/${selectedRegion?.code}/cities`
      )
    },
  })
  const cities = citiesQuery.data?.data ?? []
  const findCityByCode = (code: string) => cities.find((c) => c.code === code)
  const setCityByCode = (code: string) => setSelectedCity(findCityByCode(code))

  const [selectedBarangay, setSelectedBarangay] = useState<
    Barangay | undefined
  >(undefined)
  const brgysQuery = useQuery({
    queryKey: ['cities', selectedCity?.code],
    enabled: !!selectedCity?.code,
    queryFn: () => {
      return axios.get<Barangay[]>(
        `https://psgc.gitlab.io/api/cities/${selectedCity?.code}/barangays`
      )
    },
  })
  const barangays = brgysQuery.data?.data ?? []
  const findBrgyByCode = (code: string) =>
    barangays.find((b) => b.code === code)
  const setBrgyByCode = (code: string) =>
    setSelectedBarangay(findBrgyByCode(code))

  const [subdivisionOrVillage, setSubdivisionOrVillage] = useState<
    string | undefined
  >()
  const [streetOrBuilding, setStreetOrBuilding] = useState<string | undefined>()
  const [lotOrUnitNumber, setLotOrUnitNumber] = useState<string | undefined>()

  const constructFullAddress = (): string => {
    if (selectedRegion && selectedCity && selectedBarangay) {
      let fullAddress = ''
      if (lotOrUnitNumber) fullAddress += lotOrUnitNumber + ' '
      if (streetOrBuilding) fullAddress += streetOrBuilding + ', '
      if (subdivisionOrVillage) fullAddress += subdivisionOrVillage + ' '
      fullAddress += `Brgy. ${selectedBarangay.name}, ${selectedCity.name}, ${selectedRegion.name}`
      return fullAddress
    }
    return ''
  }

  const fullAddress = constructFullAddress()

  useEffect(() => {
    if (options.onFullAddressChange) {
      options.onFullAddressChange(fullAddress)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullAddress])

  return {
    regionsQuery,
    citiesQuery,
    brgysQuery,
    selectedRegion,
    setSelectedRegion,
    regions,
    selectedCity,
    setSelectedCity,
    cities,
    selectedBarangay,
    setSelectedBarangay,
    barangays,
    subdivisionOrVillage,
    setSubdivisionOrVillage,
    streetOrBuilding,
    setStreetOrBuilding,
    lotOrUnitNumber,
    setLotOrUnitNumber,
    findRegionByCode,
    findCityByCode,
    findBrgyByCode,
    setRegionByCode,
    setCityByCode,
    setBrgyByCode,
    fullAddress,
  }
}
