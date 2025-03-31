import { render, screen, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import BlurredLight from './BlurLights'
// import { BlurredLightsProps } from '../../types/BlurredLights'

// Define a mock for motion/react
// vi.mock('motion/react', () => ({
//     motion: {
//         div: ({ size = 200,
//             color = 'bg-blue-500',
//             initialPosition = { top: '20%', left: '30%' },
//             animationDuration = 3,
//             animationDelay = 1, // Keeping this for potential future use
//             }: BlurredLightsProps) => (
//             <div
//                 data-testid="motion-div"
//                 className={`absolute rounded-full blur-3xl opacity-0 ${color}`}
//                 style={{
//                     width: `${size}px`,
//                     height: `${size}px`,
//                     top: `${initialPosition.top}`,
//                     left: `${initialPosition.left}`,
//                 }}
//                 data-animate={{
//                     opacity: [0, 0.5, 0],
//                 }}
//                 data-transition={{
//                     delay: animationDelay,
//                     repeat: Number.POSITIVE_INFINITY,
//                     ease: "easeInOut",
//                   }}
//             >
//                 {/* Mock children or any other content here */}
//                 <div>Mocked Content</div>
//                 My Duration{animationDuration}
//             </div>
//         )
//     }
// }))

describe('BlurLights Component', () => {
    // Setup and teardown
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.restoreAllMocks() // Add this to restore mocks
        vi.useRealTimers()
    })

    it('renders with correct initial props', () => {
        const props = {
            size: 200,
            color: 'bg-blue-500',
            initialPosition: { top: '20%', left: '30%' },
            animationDuration: 3,
            animationDelay: 1
        }

        render(<BlurredLight {...props} />)

        // Fix: change getByRole to getByTestId
        const element = screen.getByTestId('motion-div')

        // Check if the element has the correct styles
        expect(element).toHaveStyle({
            width: '200px',
            height: '200px',
            top: '20%',
            left: '30%'
        })

        // Check if classes are applied correctly
        expect(element).toHaveClass('absolute rounded-full blur-3xl opacity-0 bg-blue-500')
    })

    it('updates position after animation delay and duration', async () => {
        // Mock Math.random to return predictable values
        const originalMath = global.Math
        const mockMath = Object.create(global.Math)
        mockMath.random = () => 0.5
        global.Math = mockMath

        const props = {
            size: 100,
            color: 'bg-red-500',
            initialPosition: { top: '10%', left: '10%' },
            animationDuration: 2,
            animationDelay: 1
        }

        render(<BlurredLight {...props} />)

        // Initial position
        let element = screen.getByTestId('motion-div')
        expect(element).toHaveStyle({
            top: '10%',
            left: '10%'
        })

        // Fast-forward past the delay
        act(() => {
            vi.advanceTimersByTime(1000)
        })

        // Fast-forward past one animation duration
        act(() => {
            vi.advanceTimersByTime(2000)
        })

        // Position should be updated
        element = screen.getByTestId('motion-div')
        expect(element).toHaveStyle({
            top: '50%',
            left: '50%'
        })

        // Restore original Math
        global.Math = originalMath
    })

    it('cleans up intervals and timeouts on unmount', () => {
        // Properly mock the clearTimeout and clearInterval functions
        const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
        const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

        const props = {
            size: 150,
            color: 'bg-green-500',
            initialPosition: { top: '30%', left: '40%' },
            animationDuration: 3,
            animationDelay: 2
        }

        const { unmount } = render(<BlurredLight {...props} />)

        unmount()

        expect(clearTimeoutSpy).toHaveBeenCalled()
        expect(clearIntervalSpy).toHaveBeenCalled()
    })

    it('handles multiple animation cycles', () => {
        // Mock Math.random for predictable testing
        const originalMath = global.Math
        const mockValues = [0.2, 0.3, 0.4, 0.5]
        let callCount = 0
        const mockMath = Object.create(global.Math)
        mockMath.random = () => mockValues[callCount++ % mockValues.length]
        global.Math = mockMath

        const props = {
            size: 200,
            color: 'bg-purple-500',
            initialPosition: { top: '0%', left: '0%' },
            animationDuration: 1,
            animationDelay: 0.5
        }

        render(<BlurredLight {...props} />)

        // Initial position
        let element = screen.getByTestId('motion-div')
        expect(element).toHaveStyle({
            top: '0%',
            left: '0%'
        })

        // Advance past delay
        act(() => {
            vi.advanceTimersByTime(500)
        })

        // First animation cycle
        act(() => {
            vi.advanceTimersByTime(1000)
        })

        element = screen.getByTestId('motion-div')
        expect(element).toHaveStyle({
            top: '20%',
            left: '30%'
        })

        // Second animation cycle
        act(() => {
            vi.advanceTimersByTime(1000)
        })

        element = screen.getByTestId('motion-div')
        expect(element).toHaveStyle({
            top: '40%',
            left: '50%'
        })

        // Restore original Math
        global.Math = originalMath
    })
})