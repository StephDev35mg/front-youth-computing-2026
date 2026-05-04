import axios from 'axios'

export class AxiosErrorCustom extends Error {
  constructor(error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        super(error.response.data.message)
      } else if (error.request) {
        super('Network error. Please verify your internet connection.')
      } else {
        super('An unexpected error occurred. Please try again.')
      }
    } else {
      super('An error occurred, please try again later!')
    }

    this.name = 'AxiosErrorCustom'
  }
}
