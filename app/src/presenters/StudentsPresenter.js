import { makeAutoObservable } from 'mobx'

export default class StudentsPresenter {
  search = ''
  selected = null
  modalOpen = false

  constructor(repo) {
    this.repo = repo
    makeAutoObservable(this, {}, { autoBind: true })
  }

  get filtered() {
    const q = this.search.toLowerCase()
    return this.repo.getAll().filter(s => {
      if (s.status === 'Archived') return false
      return (
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q)
      )
    })
  }

  openModal(student = null) {
    this.selected = student ? { ...student } : null
    this.modalOpen = true
  }

  closeModal() {
    this.modalOpen = false
  }

  save(data) {
    this.repo.save(data)
    this.closeModal()
  }

  archive(student) {
    this.repo.archive(student.id)
  }
}
