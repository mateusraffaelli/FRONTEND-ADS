import { BsExclamationCircleFill } from "react-icons/bs";

interface ExclamacaoProps {
    selecionado: boolean,
    aoSelecionar: () => void
}

const Exclamacao = ({ selecionado, aoSelecionar }: ExclamacaoProps) => {

    return (
        <BsExclamationCircleFill 
            color={`${selecionado ? 'blue' : 'gray'}`} 
            onClick={aoSelecionar}
        />)
}

export default Exclamacao