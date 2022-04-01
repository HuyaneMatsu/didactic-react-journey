export var TEST_ID_SPINNING_CIRCLE = 'spinning_circle';

export function SpinningCircle() {
    return (
        <div data-testid={ TEST_ID_SPINNING_CIRCLE } className="loader" />
    );
}

SpinningCircle.propTypes = {};
