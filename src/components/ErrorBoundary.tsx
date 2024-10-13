import { Box, Button, Text } from "grommet";
import React from "react";

class ErrorBoundary extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = { showErrors: false, hasError: false, error: null, info: null };
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true, error, info });
    }

    setShowErrors(showErrors) {
        this.setState({ showErrors });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <Box align="center">
                    <Box>
                        <Text>An error occurred, reload the page or go back and try again.</Text>
                    </Box>
                    <Box direction="row" gap="small">
                        <Button label="Back" onClick={() => (window.location.pathname = "/")}></Button>
                        <Button label="Reload" onClick={() => window.location.reload()}></Button>
                    </Box>
                    <Text size="small" color="background-front" onClick={() => this.setShowErrors(!this.state.showErrors)}>
                        Details
                    </Text>
                    {this.state.showErrors && (
                        <>
                            <br />
                            <code>{JSON.stringify(this.state.error, null, 2)}</code>
                            <br />
                            <code>{JSON.stringify(this.state.info, null, 2)}</code>
                        </>
                    )}
                </Box>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
