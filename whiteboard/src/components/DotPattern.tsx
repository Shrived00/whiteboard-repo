import { useId, SVGProps } from "react";
import { cn } from "../lib/utils";

// Define the props interface
interface DotPatternProps extends SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    cx?: number;
    cy?: number;
    cr?: number;
    className?: string;
}

export function DotPattern({
    width = 20,
    height = 20,
    x = 0,
    y = 0,
    cx = 10,  // Adjusted to center the circle within the pattern
    cy = 10,  // Adjusted to center the circle within the pattern
    cr = 1,
    className,
    ...props
}: DotPatternProps) {
    const id = useId();

    return (
        <svg
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/80",
                className,
            )}
            {...props}
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    patternContentUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <circle cx={cx} cy={cy} r={cr} />
                </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
        </svg>
    );
}

export default DotPattern;
