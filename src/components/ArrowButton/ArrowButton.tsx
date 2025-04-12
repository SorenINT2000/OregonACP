import React from 'react';
import { Button, Text } from '@mantine/core';
import { IconArrowBigRightFilled } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import classes from './ArrowButton.module.css';

interface ArrowButtonProps {
  text: string;
  onClick?: () => void;
  gradient?: { from: string; to: string };
  fullWidth?: boolean;
  className?: string;
  link?: string;
  openInNewTab?: boolean;
}

export function ArrowButton({
  text,
  onClick,
  gradient = { from: 'pink', to: 'yellow' },
  fullWidth = false,
  className,
  link,
  openInNewTab = false,
}: ArrowButtonProps) {
  const buttonContent = (
    <>
      <div className={classes.controlContent}>
        <Text className={classes.text} fw={900} tt="uppercase">{text}</Text>
      </div>
      <IconArrowBigRightFilled className={classes.arrow} size={20} />
    </>
  );

  if (link) {
    if (openInNewTab) {
      return (
        <Button
          component="a"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          variant="gradient"
          gradient={gradient}
          size="xl"
          className={`${classes.control} ${className || ''}`}
          fullWidth={fullWidth}
        >
          {buttonContent}
        </Button>
      );
    }
    return (
      <Button
        component={Link}
        to={link}
        variant="gradient"
        gradient={gradient}
        size="xl"
        className={`${classes.control} ${className || ''}`}
        fullWidth={fullWidth}
      >
        {buttonContent}
      </Button>
    );
  }

  return (
    <Button
      variant="gradient"
      gradient={gradient}
      size="xl"
      className={`${classes.control} ${className || ''}`}
      onClick={onClick}
      fullWidth={fullWidth}
    >
      {buttonContent}
    </Button>
  );
} 