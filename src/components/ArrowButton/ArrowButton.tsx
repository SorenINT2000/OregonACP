import React from 'react';
import { Button, Text } from '@mantine/core';
import { IconArrowBigRightFilled } from '@tabler/icons-react';
import classes from './ArrowButton.module.css';

interface ArrowButtonProps {
  text: string;
  onClick?: () => void;
  gradient?: { from: string; to: string };
  fullWidth?: boolean;
  className?: string;
}

export function ArrowButton({
  text,
  onClick,
  gradient = { from: 'pink', to: 'yellow' },
  fullWidth = false,
  className,
}: ArrowButtonProps) {
  return (
    <Button
      variant="gradient"
      gradient={gradient}
      size="xl"
      className={`${classes.control} ${className || ''}`}
      onClick={onClick}
      fullWidth={fullWidth}
    >
      <div className={classes.controlContent}>
        <Text className={classes.text} fw={900}tt="uppercase">{text}</Text>
      </div>
      <IconArrowBigRightFilled className={classes.arrow} size={20} />
    </Button>
  );
} 