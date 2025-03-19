'use client';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import { CustomButton, CustomButtonProps } from '../../buttons/CustomButton';
import { ReactNode, useEffect, useState } from 'react';

type DropdownItemProps = {
  startContent?: ReactNode;
  name: string;
  onClick?: () => void;
  key: number | string;
};

export default function CustomModal({
  form,
  buttonProps,
  size,
  isButton = true,
  dropdownList,
  drownDownMenu,
}: {
  size?:
    | 'sm'
    | 'md'
    | 'lg'
    | '3xl'
    | 'xs'
    | 'xl'
    | '2xl'
    | '4xl'
    | '5xl'
    | 'full'
    | undefined;
  drownDownMenu?: ReactNode;
  dropdownList?: DropdownItemProps[];
  buttonProps: CustomButtonProps;
  isButton?: boolean;
  form: (
    currentStep: number,
    setStep: (step: number) => void,
    onCloseModal: () => void,
  ) => ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0); // Resetea el paso actual cuando el modal se abre
    }
  }, [isOpen]);

  return (
    <>
      {isButton ? (
        <CustomButton
          isButtonModal={true}
          title={buttonProps.title!}
          color={buttonProps.color}
          variant={buttonProps.variant}
          onClick={onOpen}
          size={buttonProps.size}
          isIconOnly={buttonProps.isIconOnly}
          icon={buttonProps.icon}
          radius={buttonProps.radius}
          info={buttonProps.info}
        />
      ) : (
        <Dropdown className="border-1 border-default-200 bg-background">
          <DropdownTrigger>{drownDownMenu}</DropdownTrigger>
          <DropdownMenu>
            {(dropdownList || []).map((item) => (
              <DropdownItem
                key={item.key}
                startContent={item.startContent}
                color={'default'}
                onClick={item.onClick ?? onOpen}
              >
                {item.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      )}
      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        size={size ?? 'lg'}
        onClose={onClose}
        isDismissable={false}
      >
        <ModalContent style={{ maxHeight: '95vh' }}>
          {form(currentStep, setCurrentStep, onClose)}
        </ModalContent>
      </Modal>
    </>
  );
}
