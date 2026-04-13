import React from 'react';
/**
 * MdComponents
 *
 * Component map for react-markdown that replaces default HTML elements
 * with styled equivalents using the project's design tokens.
 *
 * Pass to <ReactMarkdown components={MdComponents}> to render AI-generated
 * markdown responses consistently with the HEFTI design system.
 *
 * @example
 * import { MdComponents } from '../lib/mdComponents';
 * <ReactMarkdown components={MdComponents}>{content}</ReactMarkdown>
 */

export const MdComponents = {
  h1: ({ children }) => (
    <h1 className="text-heading-sm text-core-black mt-5 mb-3">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-heading-xs text-core-black mt-4 mb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-label-lg text-core-black mt-3 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-paragraph-base text-core-black mb-3">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-paragraph-base text-core-black">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="text-core-black font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  hr: () => <hr className="border-border-primary my-4" />,
};
