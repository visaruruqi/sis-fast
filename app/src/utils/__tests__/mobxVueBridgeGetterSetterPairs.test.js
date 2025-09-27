import { describe, it, expect, vi } from 'vitest'
import { makeAutoObservable } from 'mobx'

// Mock Vue's functions
vi.mock('vue', () => ({
  reactive: vi.fn((obj) => new Proxy(obj, {
    get: (target, prop) => target[prop],
    set: (target, prop, value) => {
      target[prop] = value
      return true
    }
  })),
  ref: vi.fn((value) => ({ value })),
  onUnmounted: vi.fn(),
  markRaw: vi.fn((value) => value)
}))

import { useMobxBridge } from '../mobxVueBridge'

describe('MobX-Vue Bridge All Getters as Computed', () => {
  it('should treat all getters as computed properties (read-only)', () => {
    class TestPresenter {
      constructor() {
        this.vm = {
          show_datepicker: false,
          booking_details_popup: false,
          loading: false,
          property_details: false
        }
        makeAutoObservable(this)
      }

      // Getter/setter pairs - should be treated as regular properties (two-way binding)
      get showDatepicker() {
        return this.vm.show_datepicker
      }

      set showDatepicker(val) {
        this.vm.show_datepicker = val
      }

      get bookingDetailsPopup() {
        return this.vm.booking_details_popup
      }

      set bookingDetailsPopup(val) {
        this.vm.booking_details_popup = val
      }

      get loading() {
        return this.vm.loading
      }

      set loading(val) {
        this.vm.loading = val
      }

      get showPropertyDetails() {
        return this.vm.property_details
      }

      set showPropertyDetails(val) {
        this.vm.property_details = val
      }

      // Computed-only getter - should be treated as computed property (read-only)
      get computedValue() {
        return this.vm.loading ? 'Loading...' : 'Ready'
      }

      // Regular method
      toggleShowDatepicker() {
        this.vm.show_datepicker = !this.vm.show_datepicker
      }
    }

    const presenter = new TestPresenter()
    const state = useMobxBridge(presenter)

    console.log('Available properties on state:', Object.keys(state))

    // Test that all getters are available as computed properties (read-only)
    expect(state.showDatepicker).toBeDefined()
    expect(state.bookingDetailsPopup).toBeDefined()
    expect(state.loading).toBeDefined()
    expect(state.showPropertyDetails).toBeDefined()

    // Test initial values
    expect(state.showDatepicker).toBe(false)
    expect(state.bookingDetailsPopup).toBe(false)
    expect(state.loading).toBe(false)
    expect(state.showPropertyDetails).toBe(false)

    // Test that all getters are read-only (cannot be assigned to)
    expect(() => {
      state.showDatepicker = true
    }).toThrow(/Cannot assign to computed property/)

    expect(() => {
      state.bookingDetailsPopup = true
    }).toThrow(/Cannot assign to computed property/)

    expect(() => {
      state.loading = true
    }).toThrow(/Cannot assign to computed property/)

    expect(() => {
      state.showPropertyDetails = true
    }).toThrow(/Cannot assign to computed property/)

    // Test that MobX -> Vue sync works (change via presenter)
    presenter.showPropertyDetails = true
    expect(state.showPropertyDetails).toBe(true)

    // Test that computed properties are read-only
    expect(state.computedValue).toBe('Ready') // loading is false, so it should be 'Ready'
    expect(() => {
      state.computedValue = 'Should not work'
    }).toThrow(/Cannot assign to computed property/)

    // Test that methods are available
    expect(typeof state.toggleShowDatepicker).toBe('function')
    
    // Test method execution
    state.toggleShowDatepicker()
    expect(state.showDatepicker).toBe(true) // Should toggle to true (was false initially)
    expect(presenter.vm.show_datepicker).toBe(true)
  })

  it('should treat all getters as computed in SecondHeaderPresenter-like class', () => {
    class SecondHeaderPresenter {
      constructor() {
        this.vm = {
          dates: ['', ''],
          updatedDates: ['', ''],
          occupants: '',
          children: '',
          booking_details_popup: false,
          show_datepicker: false,
          property_details: false,
          loading: false,
          showBookingSummary: false,
        }
        makeAutoObservable(this)
      }

      get bookingDetailsPopup() {
        return this.vm.booking_details_popup
      }

      set bookingDetailsPopup(val) {
        this.vm.booking_details_popup = val
      }

      get showDatepicker() {
        return this.vm.show_datepicker
      }

      set showDatepicker(val) {
        this.vm.show_datepicker = val
      }

      get showPropertyDetails() {
        return this.vm.property_details
      }

      set showPropertyDetails(val) {
        this.vm.property_details = val
      }

      get loading() {
        return this.vm.loading
      }

      set loading(val) {
        this.vm.loading = val
      }

      // Computed properties (read-only)
      get disableChangeDate() {
        return this.vm.updatedDates.every((date) => date !== '' && date !== null)
      }

      get headerFormattedDates() {
        const [start, end] = this.vm.updatedDates;
        return start && end ? `${start} - ${end}` : 'No dates selected';
      }

      // Methods
      toggleShowPropertyDetails() {
        this.vm.property_details = !this.vm.property_details
      }

      toggleShowDatepicker() {
        this.vm.show_datepicker = !this.vm.show_datepicker
      }
    }

    const presenter = new SecondHeaderPresenter()
    const state = useMobxBridge(presenter)

    console.log('SecondHeaderPresenter state properties:', Object.keys(state))

    // Test that all getters are available as computed properties
    expect(state.bookingDetailsPopup).toBeDefined()
    expect(state.showDatepicker).toBeDefined()
    expect(state.showPropertyDetails).toBeDefined()
    expect(state.loading).toBeDefined()
    expect(state.disableChangeDate).toBeDefined()
    expect(state.headerFormattedDates).toBeDefined()

    // Test initial values
    expect(state.showDatepicker).toBe(false)
    expect(state.bookingDetailsPopup).toBe(false)
    expect(state.loading).toBe(false)
    expect(state.showPropertyDetails).toBe(false)
    expect(state.disableChangeDate).toBe(false) // Both dates are empty
    expect(state.headerFormattedDates).toBe('No dates selected')

    // Test that ALL getters are read-only (including former getter/setter pairs)
    expect(() => {
      state.showDatepicker = true
    }).toThrow(/Cannot assign to computed property/)

    expect(() => {
      state.bookingDetailsPopup = true
    }).toThrow(/Cannot assign to computed property/)

    expect(() => {
      state.loading = true
    }).toThrow(/Cannot assign to computed property/)

    expect(() => {
      state.showPropertyDetails = true
    }).toThrow(/Cannot assign to computed property/)

    expect(() => {
      state.disableChangeDate = true
    }).toThrow(/Cannot assign to computed property/)

    expect(() => {
      state.headerFormattedDates = 'test'
    }).toThrow(/Cannot assign to computed property/)

    // Test methods
    expect(typeof state.toggleShowDatepicker).toBe('function')
    expect(typeof state.toggleShowPropertyDetails).toBe('function')

    // Test method execution - methods can modify the underlying vm properties
    // which will be reflected in the computed getters
    state.toggleShowDatepicker()
    expect(state.showDatepicker).toBe(true) // Should toggle to true

    state.toggleShowPropertyDetails()
    expect(state.showPropertyDetails).toBe(true) // Should toggle to true
    
    // Test that changes via presenter methods are reflected in computed properties
    presenter.vm.show_datepicker = false
    expect(state.showDatepicker).toBe(false) // Should reflect the change
  })
})
