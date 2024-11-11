import * as React from "react";
import { Box, Layer } from "grommet";
import ScrollContainer from "./ScrollContainer";

const Modal = ({ isOpen, setIsOpen, children }: { isOpen: boolean; setIsOpen?: Function; children: any }) => {
    if (isOpen)
        return (
            <Layer responsive={true} onEsc={() => setIsOpen && setIsOpen(false)} onClickOutside={() => setIsOpen && setIsOpen(false)}>
                <ScrollContainer direction={"-y"}>
                    <Box pad="medium">{children}</Box>
                </ScrollContainer>
            </Layer>
        );

    return <></>;
};

export default Modal;
