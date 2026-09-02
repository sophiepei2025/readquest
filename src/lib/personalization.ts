/**
 * Template variable replacement for personalized quiz content.
 *
 * Replaces {{variable_name}} placeholders in templates with actual values.
 * Primary use case: inserting student's name into scenario questions.
 *
 * @example
 * personalize("{{student_name}} turns on a flashlight...", { student_name: "Simon" })
 * // => "Simon turns on a flashlight..."
 */
export function personalize(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (match, key: string) => variables[key] ?? match
  );
}
