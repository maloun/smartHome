import './Services.css'

interface Interface {
    title:string
}

export const ServiceWorkItem = ({title}:Interface) => {
  return(
          <div className={'service-work-item'}>{title}</div>
  )
}